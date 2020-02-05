module Api::V2
  class PermissionsController < ApplicationApiController
    def index
      authorize! :write, Role
    end
  end
end