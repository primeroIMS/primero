module Api::V2
  class ChildrenController < ApplicationApiController
    include Concerns::Pagination
    include Concerns::Record
  end
end