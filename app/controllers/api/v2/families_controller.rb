# frozen_string_literal: true

# Main API controller for Families
class Api::V2::FamiliesController < ApplicationApiController
  include Api::V2::Concerns::Pagination
  include Api::V2::Concerns::Record

  def query_scope
    { user: {} }
  end
end
