module TransitionActions
  extend ActiveSupport::Concern

  include SelectActions

  def transition
    authorize! :referral, model_class if is_referral?
    authorize! :transfer, model_class if is_transfer?
    get_selected_ids

    @records = []
    if @selected_ids.present?
      @records = model_class.all(keys: @selected_ids).all
      @records = @records.select{|r| is_consent_given? r } unless consent_override
    else
      flash[:notice] = t('referral.no_records')
      redirect_to :back and return
    end

    if @records.blank?
      #TODO - should we log or display something here?
      logger.info "#{model_class.parent_form}s not transitioned... no eligible records"
      redirect_to :back
    else
      log_to_history(@records)

      if is_remote?
        begin
          remote_transition(@records)
        rescue
          #TODO
          logger.error "#{model_class.parent_form}s not transitioned to remote #{@to_user_remote}... failure"
        end
      else
        local_transition(@records)
        redirect_to :back
      end
    end
  end

  def consent_count
    get_selected_ids

    records = []
    records = model_class.all(keys: @selected_ids).all if @selected_ids.present?

    total_count = records.size
    #For this count, do not factor in local transfers which are always allowed and would thus skew the count
    consent_count = records.select{|r| r.given_consent(transition_type) }.size

    render json: {:record_count => total_count, :consent_count => consent_count}
  end

  private

  def is_consent_given?(record)
    (is_transfer? && !is_remote?) || record.given_consent(transition_type)
  end

  def remote_transition(records)
    if is_transfer?
      set_status_transferred(records)
    elsif is_referral?
      #On referrals, only want to send the most recent referral
      records.each {|r| r.reject_old_transitions}
    end
    exporter = (is_remote_primero? ? Exporters::JSONExporter : Exporters::CSVExporter)
    transition_user = User.new(
                      role_ids: [transition_role],
                      module_ids: ["primeromodule-cp", "primeromodule-gbv"]
                    )
    #TODO filter records per consent
    props = filter_permitted_export_properties(records, model_class.properties, transition_user)
    export_data = exporter.export(records, props, current_user)
    encrypt_data_to_zip export_data, filename(records, exporter, transition_type), password
  end

  def set_status_transferred(transfer_records)
    #Only update to TRANSFERRED status on Cases
    if model_class == Child
      transfer_records.each do |transfer_record|
        transfer_record.child_status = "Transferred"
        transfer_record.record_state = false
        transfer_record.save!
      end
    end
  end

  def local_transition(records)
    to_user_local
    if @new_user.present?
      if is_referral?
        local_referral(records)
      elsif is_transfer? == true
        local_transfer(records)
      end
    end
  end

  def local_referral(referral_records)
    referral_records.each do |record|
      if transition_valid(record, @new_user)
        record.assigned_user_names |= [@to_user_local] if @to_user_local.present?
        record.save!
      else
        logger.error "#{model_class.parent_form} #{record.short_id} not referred to #{@to_user_local}... not valid"
      end
    end
  end

  def local_transfer(transfer_records)
    transfer_records.each do |transfer_record|
      if transition_valid(transfer_record, @new_user)
        if @new_user.user_name != transfer_record.owned_by
          #TODO - possibly need to push this functionality down to ownable concern
          transfer_record.previously_owned_by = transfer_record.owned_by
          transfer_record.owned_by = @new_user.user_name
          transfer_record.owned_by_full_name = @new_user.full_name
          transfer_record.save
          #TODO log stuff
        end
      else
        logger.error "#{model_class.parent_form} #{transfer_record.short_id} not transferred to #{@to_user_local}... not valid"
      end
    end
  end

  def transition_valid(record, user)
    isValid = (user.permissions.include? model_class.parent_form) && (user.module_ids.include? record.module_id)
  end

  def password
    @password = (params[:password].present? ? params[:password] : "")
  end

  def filename(models, exporter, transition_type)
    if params[:file_name].present?
      "#{params[:file_name]}.#{exporter.mime_type}"
    elsif models.length == 1
      "#{models[0].unique_identifier}-#{transition_type}.#{exporter.mime_type}"
    else
      "#{current_user.user_name}-#{model_class.name.underscore}-#{transition_type}.#{exporter.mime_type}"
    end
  end

  def log_to_history(records)
    records.each do |record|
      record.add_transition(transition_type, to_user_local, to_user_remote, to_user_agency, notes, is_remote?,
                            is_remote_primero?, current_user.user_name, consent_overridden(record), service)
      #TODO - should this be done here or somewhere else?
      #ONLY save the record if remote transfer/referral.  Local transfer/referral will update and save the record(s)
      record.save if is_remote?
    end
  end

  def is_transfer?
    transition_type == Transition::TYPE_TRANSFER
  end

  def is_referral?
    transition_type == Transition::TYPE_REFERRAL
  end

  def is_remote?
    @remote ||= (params[:is_remote].present? && params[:is_remote] == 'true')
  end

  def is_remote_primero?
    @remote_primero ||= (params[:remote_primero].present? && params[:remote_primero] == 'true')
  end

  def transition_role
    @transition_role ||= (params[:transition_role].present? ? params[:transition_role] : "")
  end

  def transition_type
    @transition_type ||= (params[:transition_type].present? ? params[:transition_type] : "")
  end

  def to_user_local
    @new_user ||= User.find_by_user_name(params[:existing_user]) if params[:existing_user].present?
    @to_user_local ||= (params[:existing_user].present? ? params[:existing_user] : "")
  end

  def to_user_remote
    @to_user_remote ||= (params[:other_user].present? ? params[:other_user] : "")
  end

  def to_user_agency
    @to_user_agency ||= (params[:other_user_agency].present? ? params[:other_user_agency] : "")
  end

  def service
    @service ||= (params[:service].present? ? params[:service] : "")
  end

  def notes
    @notes ||= (params[:notes].present? ? params[:notes] : "")
  end

  def consent_override
    @consent_override ||= (params[:consent_override].present? && params[:consent_override] == "true")
  end

  def consent_overridden(record)
    consent_override && !(is_consent_given?(record))
  end

end