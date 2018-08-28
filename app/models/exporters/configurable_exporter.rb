module Exporters
  class ConfigurableExporter < BaseExporter
    def initialize(output_file_path=nil, export_config_id=nil)
      super(output_file_path)
      @export_configuration = ExportConfiguration.get(export_config_id) if export_config_id.present?
    end

    def properties_to_export(props={})
      return props if config_property_keys.blank?
      properties_to_export = {}
      config_property_keys.each do |config_key|
        prop = props.select{|k,_| k == config_key}
        properties_to_export.merge!(prop) if prop.present?
      end
      properties_to_export
    end

    def config_property_keys
      @config_property_keys ||= @export_configuration.present? ? @export_configuration.property_keys : []
    end

  end
end
