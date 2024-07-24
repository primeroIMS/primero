# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Class for Alert Controller
class Api::V2::AlertsController < Api::V2::RecordResourceController
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

  def destroy
    authorize! :remove_alert, @record
    @record.remove_alert_by_unique_id!(params[:id])
  end

  def index_action_message
    'show_alerts'
  end
end
