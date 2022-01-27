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

  def apply_params(query)
    params.each do |param|
      query = query.where(self.class.date_range_query(param)) if param.class == SearchFilters::DateRange
    end

    query
  end
end
