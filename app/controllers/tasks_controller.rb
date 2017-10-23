class TasksController < ApplicationController

  #include RecordFilteringPagination

  def index
    authorize! :index, Task
    # search = Child.search do
    #   with(:child_status, Child::STATUS_OPEN)
    #   with(:record_state, true)
    #   with(:owned_by, current_user.user_name)
    #   order_by(:created_at, :desc)
    #   paginate(pagination)
    # end

    cases = Child.by_owned_by.key(current_user.user_name)
            .select{|c| c.record_state && c.child_status == Child::STATUS_OPEN}
    @tasks = Task.from_case(cases)
    @tasks = @tasks.paginate


    @current_modules = nil #Hack because this is expected in templates used.
    @total_records = @tasks.size
    @per = per_page

  end

end