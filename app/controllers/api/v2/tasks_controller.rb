module Api::V2
  class TasksController < ApplicationApiController
    include Concerns::Pagination

    def index
      authorize! :index, Task
      results = current_user.tasks(pagination)
      @tasks = results[:tasks]
      @total = results[:total]
    end
  end
end