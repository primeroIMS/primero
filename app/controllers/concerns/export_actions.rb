module ExportActions
  extend ActiveSupport::Concern

  #TODO - This method remains here though it is called in record_actions and transition_actions
  #TODO - This may need some future refactor / cleanup
  def authorized_export_properties(exporter, user, primero_modules, model_class)
    if exporter.authorize_fields_to_user?
      if exporter.id == 'list_view_csv'
        # Properties for this exporter are calculated in csv_exporter_list_view.rb
        properties_by_module = []
      else
        properties_by_module = model_class.get_properties_by_module(user, primero_modules)
      end
      properties_by_module
    else
      []
    end
  end

  def respond_to_export(format, models)
    if params[:selected_records].present?
      selected_records = params[:selected_records].split(",")
      models = models.select {|m| selected_records.include? m.id } if selected_records.present?
    end

    #TODO: This is poorly implemented: this is called for every index action and iterates over each exporter every time
    Exporters::active_exporters_for_model(model_class).each do |exporter|
      format.any(exporter.id) do
        authorize! :export, model_class
        LogEntry.create!(
          :type => LogEntry::TYPE[exporter.id],
          :user_name => current_user.user_name,
          :organization => current_user.organization,
          :model_type => model_class.name.downcase,
          :ids => models.collect(&:id))
        props = export_properties(exporter)
        file_name = export_filename(models, exporter)
        if models.present?
          export_data = exporter.export(models, props, current_user, params[:custom_exports])
          cookies[:download_status_finished] = true
          encrypt_data_to_zip export_data, file_name, params[:password]
        else
          queue_bulk_export(exporter.id, props, file_name)
          flash[:notice] = "#{t('exports.queueing')}: #{file_name}"
          redirect_back_or_default
        end
      end
    end
  end

  #exporter is passed in because it is needed in the overidden method in record_actions
  def export_properties(exporter)
    model_class.properties
  end

  def queue_bulk_export(format, props, file_name)
    bulk_export = BulkExport.new
    bulk_export.owned_by = current_user.user_name
    bulk_export.format = format
    bulk_export.record_type = model_class.parent_form
    bulk_export.model_range = 'all' #For now hardcoded
    bulk_export.filters = filter
    bulk_export.order = order
    bulk_export.query = params[:query]
    bulk_export.match_criteria = @match_criteria
    bulk_export.permitted_properties = props
    bulk_export.custom_export_params = params['custom_exports']
    bulk_export.file_name = file_name
    bulk_export.password = params['password'] #TODO: bad, change
    if bulk_export.mark_started
      BulkExportJob.perform_later(bulk_export.id)
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

  def filter_permitted_export_properties(models, props)
    props
  end

  def download_all_forms

    #binding.pry
    #puts "I'm HEREEEEEEE"
    forms_exporter = Exporters::FormExporter.new

    # TODO: This code is copied from lines 37-39 of this file. Figure out if this can be used for downloading the exported forms spreadsheet
    file = forms_exporter.export_forms_to_spreadsheet
    cookies[:download_status_finished] = true
    # downloaded data doesn't need to be encrypted, but follow this lead to figure out how to download that file!
    encrypt_data_to_zip export_data, file_name, params[:password]
  end
end
