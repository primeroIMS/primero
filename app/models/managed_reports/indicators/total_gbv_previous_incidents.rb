# frozen_string_literal: true

# An indicator that returns the total of incidents with a previous incident
class ManagedReports::Indicators::TotalGBVPreviousIncidents < ManagedReports::SqlReportIndicator
  class << self
    def id
      'gbv_previous_incidents'
    end
  end

  def execute_query
    query = Incident.where("data ->> 'gbv_previous_incidents' = 'true'")
    apply_params(query).count
  end

  def apply_params(query)
    params.each do |param|
      query = query.where(self.class.date_range_query(param)) if param.class == SearchFilters::DateRange
    end

    query
  end
end
