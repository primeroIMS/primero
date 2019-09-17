module TransitionActions
  extend ActiveSupport::Concern

  def transition
    authorize! :referral, model_class if is_referral?
    authorize! :assign, model_class if is_reassign?
    authorize! :transfer, model_class if is_transfer?

    @records << @record if @record.present?
    all_record_count = 0
    if @records.present?
      all_record_count = @records.size
      @records = @records.select{|r| is_consent_given?(r) } unless is_reassign? || consent_override
    else
      flash[:notice] = t('referral.no_records_selected')
      redirect_back(fallback_location: root_path) and return
    end

    if @records.blank?
      logger.info "#{model_class.parent_form}s not transitioned... no eligible records"
      message_failure_transition all_record_count
      redirect_back(fallback_location: root_path)
    else
      log_to_history(@records)

      if is_remote?
        begin
          remote_transition(@records)
          message_success_transition @records.size
        rescue => error
          logger.error "#{model_class.parent_form}s not transitioned to remote #{@to_user_remote}... failure"
          logger.error error.message
          logger.error error.backtrace
          message_failure_transition
          redirect_back(fallback_location: root_path)
        end
      elsif is_reassign?
        begin
          local_transition(@records)
          redirect_to_list and return
        rescue => error
          redirect_back(fallback_location: root_path)
        end
      else
        begin
          local_transition(@records)
          redirect_back(fallback_location: root_path)
        rescue => error
          redirect_back(fallback_location: root_path)
        end
      end
    end
  end

  def consent_count
    total_count = @records.size
    #For this count, do not factor in local transfers which are always allowed and would thus skew the count
    consent_count = @records.try(:select) {|r| r.given_consent(transition_type) }.size

    render json: {:record_count => total_count, :consent_count => consent_count}
  end

  def request_transfer
    authorize! :request_transfer, model_class
    success = true
    error_message = ''
    begin
      load_record
      raise(I18n.t('request_transfer.error.record_not_found')) if @record.blank?
      @record.add_transition(Transition::TYPE_TRANSFER_REQUEST, @record.owned_by, '', current_user.agency&.id,
                             Transition::TO_USER_LOCAL_STATUS_INPROGRESS, request_transfer_notes,
                             false, '', current_user.user_name, false, false, '')

      @record.update_last_updated_by(current_user)
      @record.try(:add_alert, Alertable::TRANSFER_REQUEST, Alertable::TRANSFER_REQUEST, transition_form_id, current_user.user_name, current_user.agency&.id)
      if @record.save
        @record.send_request_transfer_email(current_user.id, request_transfer_notes, request.base_url)
      else
        raise(I18n.t('request_transfer.error.record_not_saved'))
      end
    rescue => error
      success = false
      error_message = error.message
    end
    flash[:notice] = I18n.t('request_transfer.success')
    render json: {success: success, error_message: error_message, reload_page: true}
  end

  private

  def is_consent_given?(record)
    record.given_consent(transition_type)
  end

  def remote_transition(records)
    if is_transfer?
      set_status_transferred(records)
    elsif is_referral?
      #On referrals, only want to send the most recent referral
      records.each {|r| r.reject_old_transitions}
    end
    transition_user_modules = current_modules
    transition_user = User.new(
                      role_ids: [transition_role],
                      module_ids: transition_user_modules.map(&:id)
                    )
    exporter = type_of_export_exporter
    #TODO: filter records per consent
    props = transition_user.permitted_fields(transition_user_modules, model_class.parent_form, true)
    export_data = exporter.export(records, props, current_user, {})
    encrypt_data_to_zip export_data, filename(records, exporter, transition_type), password
  end

  def set_status_transferred(transfer_records)
    #Only update to TRANSFERRED status on Cases
    if model_class == Child
      transfer_records.each do |transfer_record|
        transfer_record.status = Transition::TRANSFERRED_STATUS
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
      elsif is_reassign? || is_transfer?
        local_transfer(records)
      end
    end
  end

  def local_referral(referral_records)
    failed_count = 0
    referral_records.each do |record|
      if transition_valid(record, @new_user)
        record.assigned_user_names |= [@to_user_local] if @to_user_local.present?
        if record.save
          record.send_transition_email(Transition::TYPE_REFERRAL, request.base_url) if @system_settings.try(:notification_email_enabled)
        else
          failed_count += 1
        end
      else
        logger.error "#{model_class.parent_form} #{record.short_id} not referred to #{@to_user_local}... not valid"
        failed_count += 1
      end
    end
    if failed_count > 0
      message_failure_transition failed_count
    else
      message_success_transition  referral_records.size
    end
  end

  def local_transfer(transfer_records)
    failed_count = 0
    transfer_records.each do |transfer_record|
      if transition_valid(transfer_record, @new_user)
        #Target user should be other than the owner of the record, right?
        if @new_user.user_name != transfer_record.owned_by
          if is_reassign?
            #When is a reassign the user became the owner of the record.
            transfer_record.previously_owned_by = transfer_record.owned_by
            transfer_record.owned_by = @new_user.user_name
            transfer_record.owned_by_full_name = @new_user.full_name
            transfer_record.reassigned_tranferred_on = DateTime.now
          elsif is_transfer?
            #Referred users will be on the assigned users until the user accept or reject the referral.
            transfer_record.assigned_user_names |= [@to_user_local] if @to_user_local.present?
            transfer_record.transfer_status = to_user_local_status
            transfer_record.reassigned_tranferred_on = DateTime.now
          end
          if transfer_record.save
            transfer_record.send_transition_email(transition_type, request.base_url) if @system_settings.try(:notification_email_enabled)
          else
            failed_count += 1
          end
        else
          logger.error "#{model_class.parent_form} #{transfer_record.short_id} not transferred to #{@to_user_local}... because the target user is the same record owner"
          failed_count += 1
        end
      else
        logger.error "#{model_class.parent_form} #{transfer_record.short_id} not transferred to #{@to_user_local}... not valid"
        failed_count += 1
      end
    end
    if failed_count > 0
      message_failure_transition failed_count
    else
      message_success_transition transfer_records.size
    end
  end

  def transition_valid(record, user)
    isValid = (user.role.permissions.any?{|ps| ps.resource == model_class.parent_form}) && (user.module_ids.include? record.module_id)
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
      record.add_transition(transition_type, to_user_local, to_user_remote, to_user_agency, to_user_local_status, notes,
                            is_remote?, type_of_export, current_user.user_name, consent_overridden(record), consent_individual_transfer, service)
      #TODO - should this be done here or somewhere else?
      #ONLY save the record if remote transfer/referral.  Local transfer/referral will update and save the record(s)
      record.set_service_as_referred( service_object_id )
      record.save if is_remote?
    end
  end

  def is_transfer?
    transition_type == Transition::TYPE_TRANSFER
  end

  def is_reassign?
    transition_type == Transition::TYPE_REASSIGN
  end

  def is_referral?
    transition_type == Transition::TYPE_REFERRAL
  end

  def is_remote?
    @remote ||= (params[:is_remote].present? && params[:is_remote] == 'true')
  end

  def type_of_export
    @type_of_export ||= (params[:type_of_export].present? ? params[:type_of_export] : "")
  end

  def type_of_export_exporter
    @type_of_export_exporter ||= case type_of_export
    when Transitionable::EXPORT_TYPE_PRIMERO
      Exporters::JSONExporter
    when Transitionable::EXPORT_TYPE_NON_PRIMERO
      Exporters::CSVExporter
    when Transitionable::EXPORT_TYPE_PDF
      Exporters::PDFExporter
    else
      nil
    end
  end

  def is_single_or_batch?
    @single_or_batch ||= (params[:id].present? ? "single" : "batch")
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

  def to_user_local_status
    if is_remote? || transition_type == Transition::TYPE_REASSIGN
      ""
    else
      @to_user_local_status ||= (params[:to_user_local_status].present? ? params[:to_user_local_status]: default_transition_status)
    end
  end

  def default_transition_status
    if transition_type == Transition::TYPE_REFERRAL || transition_type == Transition::TYPE_TRANSFER
      Transition::TO_USER_LOCAL_STATUS_INPROGRESS
    else
      ""
    end
  end

  def service
    @service ||= (params[:service].present? ? params[:service] : "")
  end

  def service_object_id
    @service_object_id ||= (params[:service_object_id].present? ? params[:service_object_id] : "")
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

  def consent_individual_transfer
    @consent_individual_transfer ||=
      (params[:consent_individual_transfer].present? && params[:consent_individual_transfer] == 'true')
  end

  def message_failure_transition(failed_count = 0)
    if is_referral?
      if is_single_or_batch? == 'single'
        flash[:notice] = t('referral.failure', record_type: record_type, id: record_id)
      else
        flash[:notice] = t('referral.failure_batch', failed_count: failed_count)
      end
    elsif is_transfer? || is_reassign?
      if is_single_or_batch? == 'single'
        flash[:notice] = t('transfer.failure', record_type: record_type, id: record_id)
      else
        flash[:notice] = t('transfer.failure_batch', failed_count: failed_count)
      end
    end
  end

  def message_success_transition(success_count = 0)
    if is_referral?
      if is_single_or_batch? == 'single'
        flash[:notice] = t('referral.success', record_type: record_type, id: record_id)
      else
        flash[:notice] = t('referral.success_batch', success_count: success_count)
      end
    elsif is_transfer? || is_reassign?
      if is_single_or_batch? == 'single'
        flash[:notice] = t('transfer.success', record_type: record_type, id: record_id)
      else
        flash[:notice] = t('transfer.success_batch', success_count: success_count)
      end
    end
  end

  def record_type
    @record_type ||= model_class.parent_form.titleize if model_class.present?
  end

  def record_id
    @record_id ||= @record.short_id if @record.present?
  end

  def request_transfer_notes
    @request_transfer_notes ||= (params[:request_transfer_notes].present? ? params[:request_transfer_notes] : "")
  end

  def transition_form_id
    #Override in parent controller to identify appropriate transition form
    #Default form is the one for Cases
    'referral_transfer'
  end
end
