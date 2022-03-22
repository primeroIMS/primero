# frozen_string_literal: true

# An indicator that returns the total of incidents
class ManagedReports::Indicators::TotalIncidents < ManagedReports::SqlReportIndicator
  class << self
    def id
      'total'
    end
  end

  def execute_query(current_user)
    query = Incident.where(ManagedReports::SqlReportIndicator.user_scope_query(current_user)) if current_user.present?
    apply_params(query || Incident).count
  end
end
