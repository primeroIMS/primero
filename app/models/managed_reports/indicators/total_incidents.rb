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
