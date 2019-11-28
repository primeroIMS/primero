module Api::V2
  class AlertsController < RecordResourceController

    def total_counts
      @record = {
        case: Child.alert_count(current_user.id),
        incident: Incident.alert_count(current_user.id),
        tracing_request: TracingRequest.alert_count(current_user.id)
      }
    end

    def index
      @alert = @record.alerts
    end

  end
end