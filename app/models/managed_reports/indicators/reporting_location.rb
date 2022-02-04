# frozen_string_literal: true

# An indicator that returns the reporting locations of violation type killing
class ManagedReports::Indicators::ReportingLocation < ManagedReports::SqlReportIndicator
  class << self
    def id
      'reporting_location'
    end

    def sql(params = [])
      # TODO: Currently we return incident_location, the reporting_location will be fix in a future ticket
      %{
        select incidents."data"->>'incident_location' as id, count(violations.id) as total
        from violations violations
        inner join incidents incidents on incidents.id = violations.incident_id
        WHERE incidents.data->>'incident_location' is not null
        #{filter_query(params)}
        group by incidents."data"->>'incident_location';
      }
    end

    def date_range_query(param)
      namespace = namespace_for_query(param.field_name)
      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          "to_timestamp(#{namespace}.data ->> ?, 'YYYY-MM-DDTHH\\:\\MI\\:\\SS') between ? and ?",
          param.field_name,
          param.from,
          param.to
        ]
      )
    end

    def equal_value_query(param)
      namespace = namespace_for_query(param.field_name)
      ActiveRecord::Base.sanitize_sql_for_conditions(
        ["#{namespace}.data ->> ? = ?", param.field_name, param.value]
      )
    end

    def build(args = {})
      super(args, &:to_a)
    end
  end
end
