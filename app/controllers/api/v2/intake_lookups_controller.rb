# frozen_string_literal: true

# Main API controller for Intake lookups.
class Api::V2::IntakeLookupsController < ApplicationApiController
  include Api::V2::Concerns::Pagination

  skip_before_action :authenticate_user!, only: %i[index]
  skip_after_action :write_audit_log, only: [:index]

  def index
    @lookups = Lookup.list(params)
    @total = @lookups.size
    @lookups = @lookups.paginate(pagination)
  end
end
