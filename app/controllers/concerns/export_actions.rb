module ExportActions
  include IndexHelper
  extend ActiveSupport::Concern

  def exported_properties
    self.model_class.properties
  end

  def respond_to_export(format, models)
    if params[:selected_records].present?
      selected_records = params[:selected_records].split(",")
      models = models.select {|m| selected_records.include? m.id } if selected_records.present?
    end

    Exporters::active_exporters_for_model(model_class).each do |exporter|
      format.any(exporter.id) do
        authorize! :export, model_class
        LogEntry.create!(
          :type => LogEntry::TYPE[exporter.id],
          :user_name => current_user.user_name,
          :organization => current_user.organization,
          :model_type => model_class.name.downcase,
          :ids => models.collect(&:id))

        unless self.respond_to?(:exported_properties)
          raise "You must specify the properties to export as a controller method called 'exported_properties'"
        end

        export_data = exporter.export(models, filter_properties, current_user)
        encrypt_data_to_zip export_data, export_filename(models, exporter), params[:password]
      end
    end
  end

  def filter_properties
    if params[:export_list_view].present? && params[:export_list_view] == "true"
      #list_view_header returns the columns that are showed in the index page.
      model = model_class.name.underscore == "child" ? "case": model_class.name.underscore
      list_view_fields = { :type => model, :fields => {} }
      list_view_header(model).each do |header|
        if header[:title].present? && header[:sort_title].present?
          list_view_fields[:fields].merge!({ header[:title].titleize => header[:sort_title] })
        end
      end
      list_view_fields
    else
      exported_properties
    end
  end

  def export_filename(models, exporter)
    "#{current_user.user_name}-#{model_class.name.underscore}.#{exporter.mime_type}"
  end
end
