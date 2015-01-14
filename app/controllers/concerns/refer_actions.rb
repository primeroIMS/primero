module ReferActions
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

    log_referral(@referral_records)

    if is_remote_referral?
      remote_referral(@referral_records)
    else
      local_referral(@referral_records)
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
    encrypt_data_to_zip export_data, referral_filename(referral_records, exporter), referral_password
  end

  def referral_password
    #TODO - Default to 123 only for testing... add validation to modal to require password like export
    referral_password = (params[:referral_password].present? ? params[:referral_password] : "123")
  end

  def referral_filename(models, exporter)
    if params[:referral_file_name].present?
      "#{params[:referral_file_name]}.#{exporter.mime_type}"
    elsif models.length == 1
      "#{models[0].unique_identifier}.#{exporter.mime_type}"
    else
      "#{current_user.user_name}-#{model_class.name.underscore}.#{exporter.mime_type}"
    end
  end

  def local_referral(referral_records)
    #TODO - implement this
    flash[:notice] = "Testing...Local Referral"
  end

  def log_referral(referral_records)
    referral_records.each do |record|
      record.add_referral(referred_to_user_local, referred_to_user_remote, referred_to_user_agency, service,
                          notes, is_remote_referral?, is_remote_primero?, current_user.user_name)
      #TODO - should this be done here or somewhere else?
      record.save
    end
  end

  def is_remote_referral?
    @remote_referral ||= (params[:is_remote].present? && params[:is_remote] == 'true')
  end

  def is_remote_primero?
    @remote_primero ||= (params[:remote_primero].present? && params[:remote_primero] == 'true')
  end

  def referred_to_user_local
    @referred_to_user_local ||= (params[:existing_user].present? ? params[:existing_user] : "")
  end

  def referred_to_user_remote
    @referred_to_user_remote ||= (params[:other_user].present? ? params[:other_user] : "")
  end

  def referred_to_user_agency
    @referred_to_user_agency ||= (params[:other_user_agency].present? ? params[:other_user_agency] : "")
  end

  def service
    @service ||= (params[:service].present? ? params[:service] : "")
  end

  def notes
    @notes ||= (params[:notes].present? ? params[:notes] : "")
  end

end