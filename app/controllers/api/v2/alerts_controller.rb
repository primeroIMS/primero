module Api::V2
  class AlertsController < ApplicationApiController

    def bulk_index
      @alerts = {
        case: Child.alert_count(current_user),
        incident: Incident.alert_count(current_user),
        tracing_request: TracingRequest.alert_count(current_user)
      }
    end

  end
end