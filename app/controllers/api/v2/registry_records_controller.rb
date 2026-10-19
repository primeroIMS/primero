# frozen_string_literal: true

# Main API controller for Registry records
class Api::V2::RegistryRecordsController < ApplicationApiController
  include Api::V2::Concerns::Pagination
  include Api::V2::Concerns::Record

  private

  def authorize_index!
    authorize!(:index, RegistryRecord)
  rescue CanCan::AccessDenied => e
    raise e unless can?(:write, Child)
  end

  def authorize_read!(model)
    authorize!(:index, model)
  rescue CanCan::AccessDenied => e
    raise e unless can?(:write, Child)
  end

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
