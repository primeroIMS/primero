# frozen_string_literal: true

# Main API controller for Case records
class Api::V2::ChildrenController < ApplicationApiController
  include Api::V2::Concerns::Pagination
  include Api::V2::Concerns::Record
end
