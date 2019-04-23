class ConfigurationBundle < ApplicationRecord

  # include Memoizable #Nothing to memoize but provides refresh infrastructure

  def self.import(model_data, applied_by=nil)
    Rails.logger.info "Starting configuration bundle import..."
    begin
      model_data.each do |model_clazz, data_arr|
        model = model_clazz.constantize

        Rails.logger.info "Removing the data for: #{model.name}"
        model.clear

        Rails.logger.info "Inserting data for: #{model.name}"
        data_arr.each { |data| model.import(data) }

        Rails.logger.info "#{model.count} records inserted for: #{model.name}"
      end

      AuditLogJob.perform_later(applied_by, 'Configuration Bundle', ConfigurationBundle.name, nil, nil, applied_by, nil)
      ConfigurationBundle.create! applied_by: applied_by
    rescue => e
      Rails.logger.error e.inspect
    end
    Rails.logger.info "Successfully completed configuration bundle import."
  end

  def self.export
    bundle_data = {}
    bundle_models.each do |model|
      bundle_data[model.name] = model.export
    end
    bundle_data
  end

  def self.export_as_json
    JSON.pretty_generate(export)
  end

  # Keep this order due a export dependencies
  def self.bundle_models
    [
      Agency, ContactInformation, FormSection, Location, Lookup,
      PrimeroProgram, PrimeroModule, Report, Role,
      UserGroup, ExportConfiguration, SystemSettings
    ]
  end

  #Ducktyping to allow refreshing
  # def self.flush_cache ; end
end
