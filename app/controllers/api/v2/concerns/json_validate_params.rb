# frozen_string_literal: true

# Enpoint for triggering an import of records
module Api::V2::Concerns::JsonValidateParams
  extend ActiveSupport::Concern

  def validate_json!(schema_supplement, records_params)
    service = JsonValidatorService.new(schema_supplement: schema_supplement)
    service.validate!(records_params)
  end
end
