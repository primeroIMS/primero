module ExportActions
  extend ActiveSupport::Concern

  def respond_to_export(format, models)
    Exporters::ACTIVE_EXPORTERS.each do |exporter|
      format.any(exporter.id) do
        authorize! "export_#{exporter.id}".to_sym, @className
        LogEntry.create! :type => LogEntry::TYPE[exporter.id], :user_name => current_user.user_name, :organisation => current_user.organisation, :child_ids => models.collect(&:id)

        unless self.respond_to?(:exported_properties)
          raise "You must specify the properties to export as a controller method called 'exported_properties'"
        end

        export_data = exporter.export(models, exported_properties)
        encrypt_data_to_zip export_data, export_filename(models, exporter), params[:password]
      end
    end
  end

  def export_filename(models, exporter)
    "#{current_user.user_name}.#{exporter.id}"
  end
end
