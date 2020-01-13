module Exporters
  class ConfigurableExporter < BaseExporter
    def initialize(output_file_path=nil, export_config_id=nil)
      super(output_file_path)
      @export_configuration = ExportConfiguration.find_by(unique_id: export_config_id) if export_config_id.present?
    end

    def properties_to_export(props = {})
      return props if config_property_keys.blank?

      properties_to_export = {}
      config_property_keys.each do |config_key|
        prop = props.select { |k, _| k == config_key }
        properties_to_export.merge!(prop) if prop.present?
      end
      properties_to_export
    end

    def opt_out_properties_to_export(props={})
      opt_out_properties_to_export = {}
      props.each do |k, v|
        prop = {}
        prop[k] = (opt_out_property_keys.include?(k) ? v : '')
        opt_out_properties_to_export.merge!(prop)
      end
      opt_out_properties_to_export
    end

    def config_property_keys
      @config_property_keys ||= @export_configuration.present? ? @export_configuration.property_keys : []
    end

    def opt_out_property_keys
      @opt_out_property_keys ||= @export_configuration.present? ? @export_configuration.property_keys_opt_out : []
    end

    def opting_out?(record)
      return false if @export_configuration.blank? || @export_configuration.opt_out_field.blank?
      record.try(:send, @export_configuration.opt_out_field) == true
    end

  end
end
