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

    if params[:is_remote].present? && params[:is_remote] == 'true'
      if params[:remote_primero].present? && params[:remote_primero] == 'true'
        #remote Primero instance referral  JSON
        props = filter_permitted_export_properties(@referral_records, exported_properties)
        export_data = Exporters::JSONExporter.export(@referral_records, props, current_user)
        #encrypt_data_to_zip export_data, export_filename(models, exporter), params[:password]
        encrypt_data_to_zip export_data, export_filename(@referral_records, Exporters::JSONExporter), "123"
      else
        #remote non-Primero instance referral  CSV
      end
    else
      #local instance referral
    end
  end

  #TODO - this is for testing...
  def export_filename(models, exporter)
    if params[:custom_export_file_name].present?
      "#{params[:custom_export_file_name]}.#{exporter.mime_type}"
    elsif models.length == 1
      "#{models[0].unique_identifier}.#{exporter.mime_type}"
    else
      "#{current_user.user_name}-#{model_class.name.underscore}.#{exporter.mime_type}"
    end
  end

end