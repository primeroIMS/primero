# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Module for Json Validate Params
module Api::V2::Concerns::JsonValidateParams
  extend ActiveSupport::Concern

  def validate_json!(schema_supplement, records_params)
    service = JsonValidatorService.new(schema_supplement:)
    service.validate!(records_params.try(:to_h))
  end
end
