# frozen_string_literal: true

# An indicator that returns the total of incidents
class ManagedReports::Indicators::TotalIncidents < ManagedReports::SqlReportIndicator
  class << self
    def id
      'total'
    end
  end

  def execute_query
    apply_params(Incident).count
  end
end
