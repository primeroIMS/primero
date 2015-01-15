module TransitionActions
  extend ActiveSupport::Concern

  include SelectActions

  def referral
    authorize! :referral, model_class
    get_selected_ids

    @referral_records = []
    if @selected_ids.present?
      @referral_records = model_class.all(keys: @selected_ids).all
    else
      #Refer all records
      @filters = record_filter(filter)
      @referral_records, @total_records = retrieve_records_and_total(@filters)
    end

    log_to_history(@referral_records, Transition::TYPE_REFERRAL)

    if is_remote?
      remote_referral(@referral_records)
    else
      local_referral(@referral_records)
      redirect_to :back
    end
  end
  
  def transfer
    authorize! :transfer, model_class
    get_selected_ids

    @transfer_records = []
    if @selected_ids.present?
      @transfer_records = model_class.all(keys: @selected_ids).all
    else
      #Transfer all records
      @filters = record_filter(filter)
      @transfer_records, @total_records = retrieve_records_and_total(@filters)
    end

    log_to_history(@transfer_records, Transition::TYPE_TRANSFER)
    
    if is_remote?
      begin
        remote_transfer(@transfer_records)
      rescue
      end
    else
      begin
        local_transfer(@transfer_records)
        flash[:notice] = t("transfers.success")
      rescue
        flash[:notice] = t("transfers.failure")
        #TODO - do we need additional logging?
      end
      redirect_to :back
    end
  end

  private

  def remote_referral(referral_records)
    exporter = (is_remote_primero? ? Exporters::JSONExporter : Exporters::CSVExporter)
    referral_user = User.new(
                      role_ids: [params[:referral_type]],
                      module_ids: ["primeromodule-cp", "primeromodule-gbv"]
                    )
    #TODO filter records per consent
    props = filter_permitted_export_properties(referral_records, model_class.properties, referral_user)
    export_data = exporter.export(referral_records, props, current_user)
    encrypt_data_to_zip export_data, filename(referral_records, exporter, Transition::TYPE_REFERRAL), password
  end
  
  def local_referral(referral_records)
    referral_records.each do |record|
      #TODO - implement this
      record.save!
    end
    flash[:notice] = "Testing...Local Referral"
  end
  
  def remote_transfer(transfer_records)
    set_status_transferred(transfer_records)
    exporter = (is_remote_primero? ? Exporters::JSONExporter : Exporters::CSVExporter)
    transfer_user = User.new(
                      role_ids: [params[:transfer_type]],
                      module_ids: ["primeromodule-cp", "primeromodule-gbv"]
                    )
    #TODO filter records per consent
    props = filter_permitted_export_properties(transfer_records, model_class.properties, transfer_user)
    export_data = exporter.export(transfer_records, props, current_user)
    encrypt_data_to_zip export_data, filename(transfer_records, exporter, Transition::TYPE_TRANSFER), password
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
  
  def local_transfer(transfer_records)
    new_user = User.find_by_user_name(params[:existing_user]) if params[:existing_user].present?
    if new_user.present?
      transfer_records.each do |transfer_record|
        if new_user.user_name != transfer_record.owned_by
          #TODO - owned_by is getting wiped out... possibly in ownable concern
          #TODO - probably need to push this functionality down to ownable concern
          transfer_record.previously_owned_by = transfer_record.owned_by
          transfer_record.owned_by = new_user.user_name
          transfer_record.owned_by_full_name = new_user.full_name
          transfer_record.save!
          #TODO log stuff
        end
      end
    end
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
  
  def log_to_history(records, transition_type)
    records.each do |record|
      record.add_transition(transition_type, to_user_local, to_user_remote, to_user_agency,
                            notes, is_remote?, is_remote_primero?, current_user.user_name, service)
      #TODO - should this be done here or somewhere else?
      #ONLY save the record if remote transfer/referral.  Local transfer/referral will update and save the record(s)
      record.save if is_remote?
    end
  end

  def is_remote?
    @remote ||= (params[:is_remote].present? && params[:is_remote] == 'true')
  end

  def is_remote_primero?
    @remote_primero ||= (params[:remote_primero].present? && params[:remote_primero] == 'true')
  end

  def to_user_local
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

end