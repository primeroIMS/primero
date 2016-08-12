module ExportActions
  extend ActiveSupport::Concern

  def authorized_export_properties(exporter, user, primero_modules, model_class)
    if exporter.id == 'list_view_csv'
      #TODO: This is an acknowledged hack. This code should really be in the exporter
      #      Refactor when we get rid of the hardcoded @is_cp, @is_admin etc.
      #      when we make filters, columns, and dashboards dynamic. Or when we get rid of the list view export
      build_list_field_by_model(model_class)
    elsif exporter.authorize_fields_to_user?
      #TODO: missing some other properties? ['base_revision', 'unique_identifier', 'upload_document', 'update_document', 'record_state']
      form_sections = FormSection.get_form_sections_by_module(primero_modules, model_class.parent_form, user)
      properties_by_module = model_class.get_properties_by_module(form_sections)
      properties_by_module = filter_fields_read_only_users(form_sections, properties_by_module, user)
    else
      []
    end
  end

  #TODO: This method is only used by exports, and duplicates logic
  #      that already exists on the record concern. Moved to export_actions, but really:
  #      PLEASE CONSOLIDATE, REFACTOR, REMOVE
  #Filter out fields the current user is not allowed to view.
  def filter_fields_read_only_users(form_sections, properties_by_module, current_user)
    if current_user.readonly?(model_class.name.underscore)
      #Filter showable properties for readonly users.
      properties_by_module.map do |pm, forms|
        forms = forms.map do |form, fields|
          #Find out the fields the user is able to view based on the form section.
          form_section_fields = form_sections[pm].select do |fs|
            fs.name == form
          end.map do |fs|
            fs.fields.map{|f| f.name if f.showable?}.compact
          end.flatten
          #Filter the properties based on the field on the form section.
          fields = fields.select{|f_name, f_value| form_section_fields.include?(f_name) }
          [form, fields]
        end
        [pm, forms.to_h.compact]
      end.to_h.compact
    else
      properties_by_module
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
        props = authorized_export_properties(exporter, current_user, current_modules, model_class)
        file_name = export_filename(models, exporter)
        if models.present?
          export_data = exporter.export(models, props, current_user, params[:custom_exports])
          cookies[:download_status_finished] = true
          encrypt_data_to_zip export_data, file_name, params[:password]
        else
          queue_bulk_export(exporter.id, props, file_name)
          flash[:notice] = "#{t('exports.queueing')}: #{file_name}"
          #TODO confirm with PAVEL - this is necessary to handle when called from rspec tests
          redirect_back_or_default
          # redirect_to(:back)
        end
      end
    end
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
    else
      "#{current_user.user_name}-#{model_class.present? ? model_class.name.underscore : class_name.name.underscore}.#{exporter.mime_type}"
    end
  end

  def filter_permitted_export_properties(models, props)
    props
  end
end
