class TracingRequestHistoriesController < ApplicationController
  helper :histories
  def index
    @tracing_request = TracingRequest.get(params[:id])
    @page_name = t "tracing_request.history_of", :short_id => @tracing_request.short_id
    @user = User.find_by_user_name(current_user_name)
  end
end
