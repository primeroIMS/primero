module Api::V2
  class ChildrenController < ApplicationApiController
    @model_class = Child

    include Concerns::Pagination
    include Concerns::Record

  end
end