# frozen_string_literal: true

# Main API controller for Incident records
class Api::V2::IncidentsController < ApplicationApiController
  include Api::V2::Concerns::Pagination
  include Api::V2::Concerns::Record
end
