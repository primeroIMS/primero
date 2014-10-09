class RecordStatusController < ApplicationController
  before_filter :set_class_name

  def set_record_status
    authorize! :update, @model_class
    success = true
    reload_page = false
    error_message = ""
    update_fields = {}

    record = @model_class.get(params[:id])
    
    update_fields['record_state'] = params[:record_state] == 'true' ? true : false

    record.update_properties(update_fields, current_user_name)

    if record.save
      reload_page = true
    else
      success = false
    end
    render :json => { :success => success, :error_message => error_message, :reload_page => reload_page }
  end

  private

  def set_class_name
    #Tag the model from the params, the parameter is injected by the routes and don't allow any arbitrary class
    #just the one defined in the routes.
    @model_class = params[:model_class].constantize
  end
end