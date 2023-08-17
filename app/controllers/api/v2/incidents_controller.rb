# frozen_string_literal: true

# Main API controller for Incident records
class Api::V2::IncidentsController < ApplicationApiController
  include Api::V2::Concerns::Pagination
  include Api::V2::Concerns::Record

  def get_case_to_link
    @permitted_field_names = PermittedFieldService.new(current_user, Child).permitted_field_names
    @selected_field_names = FieldSelectionService.select_fields_to_show(
      params, Child, @permitted_field_names, current_user
    )
    search = SearchService.search(
      Child, query_scope: query_scopes, query: params[:query],
                   sort: sort_order, pagination: pagination
    )
    @records = search.results
    render 'api/v2/records/index'
  end  


  def link_incidents_to_case
    incidents = Incident.where(id:params[:data][:incident_ids]).update_all(incident_case_id: params[:data][:incident_case_id])
    render 'api/v2/incidents/index'
  end

  def query_scopes
    current_user.record_query_scope(Child, params[:id_search])
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
