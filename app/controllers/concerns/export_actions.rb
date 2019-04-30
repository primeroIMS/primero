module ExportActions
  extend ActiveSupport::Concern

  def respond_to_export(format, models)
    if params[:selected_records].present?
      selected_records = params[:selected_records].split(",")
      models = models.select {|m| selected_records.include? m.id } if selected_records.present?
    end

    #TODO: This is poorly implemented: this is called for every index action and iterates over each exporter every time
    Exporters::active_exporters_for_model(model_class).each do |exporter|
      format.any(exporter.id) do
        authorize! :export, model_class
        fields = exporter.permitted_fields_to_export(current_user, model_class.parent_form, @current_modules)
        file_name = export_filename(models, exporter)

        if models.present?
          export_data = exporter.export(models, fields, current_user, params[:custom_exports])
          cookies[:download_status_finished] = true
          encrypt_data_to_zip export_data, file_name, params[:password]
        else
          queue_bulk_export(exporter.id, file_name)
          flash[:notice] = "#{t('exports.queueing')}: #{file_name}"
          redirect_back(fallback_location: root_path)
        end
      end
    end
  end

  def queue_bulk_export(format, file_name)
    export_class = params[:export_duplicates].present? ? DuplicateBulkExport : BulkExport
    bulk_export = export_class.new
    bulk_export.owned_by = current_user.user_name
    bulk_export.format = format
    bulk_export.record_type = model_class.parent_form
    bulk_export.model_range = 'all' #For now hardcoded
    bulk_export.filters = filter
    bulk_export.order = order
    bulk_export.query = params[:query]
    bulk_export.match_criteria = @match_criteria
    bulk_export.custom_export_params = params['custom_exports']
    bulk_export.file_name = file_name
    bulk_export.password = params['password'] #TODO: bad, change
    if bulk_export.mark_started
      bulk_export.job.perform_later(bulk_export.id)
    end
  end

  def export_filename(models, exporter, class_name = nil)
    if params[:custom_export_file_name].present?
      "#{params[:custom_export_file_name]}.#{exporter.mime_type}"
    elsif models.length == 1
      "#{models[0].unique_identifier}.#{exporter.mime_type}"
    elsif exporter.id == "unhcr_csv"
     "#{current_user.user_name}-#{model_class.present? ? model_class.name.underscore : class_name.name.underscore}-UNHCR.#{exporter.mime_type}"
    else
      "#{current_user.user_name}-#{model_class.present? ? model_class.name.underscore : class_name.name.underscore}.#{exporter.mime_type}"
    end
  end

end
