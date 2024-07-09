# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Main API controller for Registry records
class Api::V2::RegistryRecordsController < ApplicationApiController
  include Api::V2::Concerns::Pagination
  include Api::V2::Concerns::Record

  private

  alias select_updated_fields_super select_updated_fields
  def select_updated_fields
    changes = @record.saved_changes_to_record.keys +
              @record.associations_as_data_keys.select { |association| association.in?(record_params.keys) }
    @updated_field_names = changes & @permitted_field_names
  end

  def query_scope
    { user: {} }
  end
end
