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
end
