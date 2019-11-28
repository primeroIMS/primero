module Api::V2
  class AlertsController < ApplicationApiController

    def total_counts
      @record = {
        case: Child.alert_count(current_user.id),
        incident: Incident.alert_count(current_user.id),
        tracing_request: TracingRequest.alert_count(current_user.id)
      }
    end

  end
end