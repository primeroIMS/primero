# frozen_string_literal: true

module Api::V2
  class AlertsController < RecordResourceController
    def bulk_index
      @alerts = {
        case: Child.alert_count(current_user),
        incident: Incident.alert_count(current_user),
        tracing_request: TracingRequest.alert_count(current_user)
      }
    end

    def index
      authorize! :read, @record
      @alerts = @record.alerts
    end
  end
end
