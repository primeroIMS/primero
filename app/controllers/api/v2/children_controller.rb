# frozen_string_literal: true

# Main API controller for Case records
class Api::V2::ChildrenController < ApplicationApiController
  include Concerns::Pagination
  include Concerns::Record
end
