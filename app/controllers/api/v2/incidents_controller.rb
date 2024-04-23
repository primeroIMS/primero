# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Main API controller for Incident records
class Api::V2::IncidentsController < ApplicationApiController
  include Api::V2::Concerns::Pagination
  include Api::V2::Concerns::Record

  def link_incidents_to_case
    incidents = Incident.where(id:params[:data][:incident_ids]).update_all(incident_case_id: params[:data][:incident_case_id])
    render 'api/v2/incidents/index'
  end

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
    # TODO: Should check the module param to determine if mrm, not the user's module.
    if current_user.module?(PrimeroModule::MRM)
      model_query = model_class.eager_load(:violations, :perpetrators, individual_victims: :violations)
    end
    record = model_query.find(params[:id])
    # Alias the record to a more specific name: @child, @incident, @tracing_request
    instance_variable_set("@#{model_class.name.underscore}", record)
  end
end
