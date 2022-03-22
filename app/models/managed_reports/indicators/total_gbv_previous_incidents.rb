# frozen_string_literal: true

# An indicator that returns the total of incidents with a previous incident
class ManagedReports::Indicators::TotalGBVPreviousIncidents < ManagedReports::SqlReportIndicator
  class << self
    def id
      'gbv_previous_incidents'
    end
  end

  def execute_query(current_user)
    query = Incident.where("data ->> 'gbv_previous_incidents' = 'true'")
    query = query.where(ManagedReports::SqlReportIndicator.user_scope_query(current_user)) if current_user.present?
    apply_params(query).count
  end
end
