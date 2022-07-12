# frozen_string_literal: true

# Main API controller for Incident records
class Api::V2::IncidentsController < ApplicationApiController
  include Api::V2::Concerns::Pagination
  include Api::V2::Concerns::Record

  private

  def authorize_create!
    can_create = current_user.can?(:create, Incident) || current_user.can?(:incident_from_case, Child)
    raise Errors::ForbiddenOperation unless can_create
  end

  alias select_updated_fields_super select_updated_fields
  def select_updated_fields
    changes = @record.saved_changes_to_record.keys +
              @record.associations_as_data_keys.select { |association| association.in?(record_params.keys) }
    @updated_field_names = changes & @permitted_field_names
  end

  def find_record
    model_query = model_class
    if current_user.module?(PrimeroModule::MRM)
      model_query = model_class.eager_load(:violations, individual_victims: :violations)
    end
    record = model_query.find(params[:id])
    # Alias the record to a more specific name: @child, @incident, @tracing_request
    instance_variable_set("@#{model_class.name.underscore}", record)
  end
end
