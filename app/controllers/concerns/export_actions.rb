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

        export_data = exporter.export(models, filter_properties(exporter.id), current_user)
        encrypt_data_to_zip export_data, export_filename(models, exporter), params[:password]
      end
    end
  end

  def filter_properties(exporter_id)
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
    elsif exporter_id == "xls"
      expand_violations(self.model_class.properties_by_form)
        .merge({"__record__" => other_properties})
        .reject{|key| ["Photos and Audio", "Other Documents", "Summary Page"].include?(key)}
    else
      exported_properties
    end
  end

  #Create a section for this properties that don't belong to any form section, but some
  #seems to be important.
  def other_properties
    ["created_organization", "created_by_full_name", "last_updated_at",
      "last_updated_by", "last_updated_by_full_name", "posted_at",
      "unique_identifier", "record_state", "hidden_name",
      "owned_by_full_name", "previously_owned_by_full_name",
      "duplicate", "duplicate_of"].map do |name|
      [name, self.model_class.properties.select{|p| p.name == name}.flatten.first]
    end.to_h.compact
  end

  #Violations subforms is a special case for Incidents
  def expand_violations(properties_by_form)
    if properties_by_form["Violations"].present? && properties_by_form["Violations"]["violations"].present?
      violations = properties_by_form["Violations"].delete("violations")
      properties_by_form["Violations"] = violations.type.properties.map{|property| [property.name, property]}.to_h
    end
    properties_by_form
  end

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
