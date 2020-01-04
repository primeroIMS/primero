# frozen_string_literal: true

module Exporters
  # Exports records to JSON formatted text
  class JSONExporter < BaseExporter
    class << self
      def id
        'json'
      end

      def excluded_properties
        %w[encrypted_password reset_password_token reset_password_sent_at]
      end

      def supported_models
        [Child, Incident, TracingRequest]
      end
    end

    def export(models, fields, *_args)
      fields = fields_to_export(fields)
      hashes = models.map { |m| convert_model_to_hash(m, fields) }
      buffer.write(JSON.pretty_generate(hashes))
    end

    def convert_model_to_hash(model, fields)
      json_parse = JSON.parse(model.to_json)
      data_fields = json_parse['data'].select { |k, _| fields.map(&:name).include?(k) }
      json_parse['data'] = data_fields
      json_parse
    end
  end
end