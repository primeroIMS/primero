module Api::V2
  class AlertsController < ApplicationApiController

    def index
      @record = {
        case: Child.alert_count(current_user.id),
        incident: Incident.alert_count(current_user.id),
        tracing_request: TracingRequest.alert_count(current_user.id)
      }
    end

  end
end