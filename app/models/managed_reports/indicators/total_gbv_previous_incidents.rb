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
      next unless %w[date_of_first_report incident_date].include?(param.field_name)

      query = query.where(
        "to_date(data ->> '#{param.field_name}', 'YYYY-MM-DD') between ? and ?",
        param.from,
        param.to
      )
    end

    query
  end
end
