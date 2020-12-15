# frozen_string_literal: true

# API endpoint for listing the incidents associated with a case
class Api::V2::ChildrenIncidentsController < Api::V2::RecordResourceController
  before_action :permit_fields
  before_action :select_fields, only: %i[index new]

  def index
    authorize! :read, Incident
    authorize! :read, @record
    @incidents = @record.incidents
    render 'api/v2/incidents/index'
  end

  def new
    authorize! :read, Incident
    authorize! :create, Incident
    authorize! :read, @record
    @incident = IncidentCreationService.incident_from_case(@record, {}, @record.module_id, current_user)
    render 'api/v2/incidents/new'
  end

  def permit_fields
    @permitted_field_names = PermittedFieldService.new(current_user, Incident).permitted_field_names
  end

  def select_fields
    @selected_field_names = FieldSelectionService.select_fields_to_show(
      params, Incident, @permitted_field_names, current_user
    )
  end
end
