class TasksController < ApplicationController

  include RecordFilteringPagination

  def index
    authorize! :index, Task

    cases = Child.by_owned_by.key(current_user.user_name)
            .select{|c| c.record_state && c.child_status == Child::STATUS_OPEN}
    @tasks = Task.from_case(cases)
    @tasks = @tasks.paginate


    @current_modules = nil #Hack because this is expected in templates used.
    @total_records = @tasks.size
    @per_page = per_page

    if @tasks.present?
      @lookups = Lookup.where(unique_id: ['lookup-risk-level', 'lookup-service-type', 'lookup-followup-type'])
    end
  end

  def per_page
    params[:per] ? params[:per].to_i : 100
  end

end