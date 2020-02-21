# frozen_string_literal: true

module Exporters
  class ConfigurableExporter < BaseExporter
    class << self
      def mime_type
        'csv'
      end

      def supported_models
        [Child]
      end

      def authorize_fields_to_user?
        false
      end
    end

    def initialize(output_file_path = nil, export_config_id = nil)
      super(output_file_path)
      @export_configuration = ExportConfiguration.find_by(unique_id: export_config_id) if export_config_id.present?
    end

    def properties_to_export(props = {}, opting_out = false)
      return properties_from_config(props) unless opting_out

      properties_from_config(props).map { |k, v| [k, opt_out_property_keys.include?(k) ? v : ''] }.to_h
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

    def write_header(rows)
      return if @called_once

      rows << @headers
      @called_once = true
    end

    def export(cases, *_args)
      duplicate_export = CSV.generate do |rows|
        write_header(rows)
        cases.each_with_index do |record, index|
          write_case(record, index, rows)
        end
      end
      buffer.write(duplicate_export)
    end

    private

    def properties_from_config(props)
      return props if config_property_keys.blank?

      config_property_keys.map{ |config_key| props.select { |k, _| k == config_key } }.reduce(&:merge)
    end
  end
end
