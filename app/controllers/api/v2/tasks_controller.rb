module Api::V2
  class TasksController < ApplicationApiController
    include Concerns::Pagination

    def index
      authorize! :index, Task
      results = Child.get_tasks(current_user, pagination)
      @tasks = results[:tasks]
      @total = results[:total]
    end
  end
end