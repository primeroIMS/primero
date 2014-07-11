class IncidentHistoriesController < ApplicationController
  helper :histories
  def index
    @incident = Incident.get(params[:id])
    @page_name = t "incident.history_of", :short_id => @incident.short_id
    @user = User.find_by_user_name(current_user_name)
  end
end
