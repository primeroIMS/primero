class RecordHistoriesController < ApplicationController
  before_action :set_class_name

  def record_change_log
    @user = current_user
    record = @model_class.find(params[:id])
    render :partial => "record_shared/change_log", :locals => {record: record}
  end

  def set_class_name
    #Tag the model from the params, the parameter is injected by the routes and don't allow any arbitrary class
    #just the one defined in the routes.
    @model_class = params[:model_class].constantize
  end
end
