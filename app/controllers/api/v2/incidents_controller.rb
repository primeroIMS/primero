# frozen_string_literal: true

# Main API controller for Incident records
class Api::V2::IncidentsController < ApplicationApiController
  include Concerns::Pagination
  include Concerns::Record
end
