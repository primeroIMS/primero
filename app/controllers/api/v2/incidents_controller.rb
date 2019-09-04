module Api::V2
  class IncidentsController < ApplicationApiController
    include Concerns::Pagination
    include Concerns::Record
  end
end