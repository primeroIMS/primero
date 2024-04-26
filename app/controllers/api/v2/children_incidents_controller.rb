# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# API endpoint for listing the incidents associated with a case
class Api::V2::ChildrenIncidentsController < Api::V2::RecordResourceController
  before_action :permit_fields
  before_action :select_fields, only: %i[index new]
  before_action :find_record, only: %i[index new update_bulk]
  before_action :find_incidents, only: %i[update_bulk]

  def index
    authorize! :read, Incident
    authorize! :read, @record
    @incidents = @record.incidents
    render 'api/v2/incidents/index'
  end

  def new
    authorize_new!
    @incident = IncidentCreationService.incident_from_case(@record, {}, @record.module_id, current_user)
    render 'api/v2/incidents/new'
  end

  def update_bulk
    authorize_all!(:link_incident_to_case, @incidents)
    link_incidents if @incidents.present?
    updates_for_record(@record)
  end

  def permit_fields
    @permitted_field_names = PermittedFieldService.new(current_user, Incident).permitted_field_names
  end

  def select_fields
    @selected_field_names = FieldSelectionService.select_fields_to_show(
      params, Incident, @permitted_field_names, current_user
    )
  end

  private

  def authorize_new!
    case_incident =
      current_user.can?(:read, Incident) ||
      current_user.can?(:create, Incident) ||
      current_user.can?(:read, @record) ||
      current_user.can?(:incident_from_case, Child)
    raise Errors::ForbiddenOperation unless case_incident
  end

  def find_incidents
    @incidents = Incident.find(params['data']['incident_ids'])
  end

  def link_incidents
    ActiveRecord::Base.transaction do
      @incidents.each do |incident|
        incident.update(incident_case_id: @record.id)
      end
    end
  end
end
