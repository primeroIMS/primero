module Api::V2
  class ChildrenController < ApplicationApiController
    @model_class = Child

    #TODO: Do we need the fully qualified path?
    include Api::V2::Concerns::FilteringPagination
    include Api::V2::Concerns::Record

  end
end