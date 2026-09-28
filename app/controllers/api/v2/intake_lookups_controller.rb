# frozen_string_literal: true

# Main API controller for Intake lookups.
class Api::V2::IntakeLookupsController < ApplicationApiController
  include Api::V2::Concerns::Pagination

  skip_before_action :authenticate_user!, only: %i[index]

  def index
    @lookups = Lookup.list(params)
    @total = @lookups.size
    @lookups = @lookups.paginate(pagination)
    render 'api/v2/lookups/index', status: 200
  end

  private

  def model_class
    Lookup
  end
end
