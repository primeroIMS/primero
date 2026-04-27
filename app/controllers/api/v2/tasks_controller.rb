# frozen_string_literal: true

# API to fetch the list of tasks given a user
class Api::V2::TasksController < ApplicationApiController
  include Api::V2::Concerns::Pagination

  def index
    authorize! :index, Task
    results = current_user.tasks(pagination, sort_order)
    @tasks = results[:tasks]
    @total = results[:total]
  end

  def default_sort_field
    'due_date'
  end
end
