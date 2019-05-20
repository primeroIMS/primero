module Api::V2
  class IncidentsController < ApplicationApiController
    @model_class = Incident

    include Concerns::Pagination
    include Concerns::Record

  end
end