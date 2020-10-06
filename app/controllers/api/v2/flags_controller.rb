# frozen_string_literal: true

# API to fetch the list of flags given a user
class Api::V2::FlagsController < ApplicationApiController
  include Api::V2::Concerns::Pagination

  def index
    flags = Flag.by_owner(current_user.user_name)
    # TODO: finish
    # binding.pry
    # x=0
    # authorize! :index, Flag
    # results = current_user.tasks(pagination)
    # @flags = results[:tasks]
    # @total = results[:total]
  end

  # TODO: refactor other methods from old flags controller
end
