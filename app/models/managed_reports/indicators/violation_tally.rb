# frozen_string_literal: true

# An indicator that returns the violation_tally of violation type killing
class ManagedReports::Indicators::ViolationTally < ManagedReports::SqlReportIndicator
  class << self
    def id
      'violation'
    end

    def sql(params = [])
      %{
        select json_object_agg(key, sum) as data
        from (
        select key, sum(value::int)
        from violations v
        #{incident_join(params)}
        cross join json_each_text((v.data->>'violation_tally')::JSON)
        WHERE v.data->>'violation_tally' is not null
        #{filter_query(params)}
        group by key) as violation_data;
      }
    end

    def date_range_query(param)
      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          "to_timestamp(i.data ->> ?, 'YYYY-MM-DDTHH\\:\\MI\\:\\SS') between ? and ?",
          param.field_name,
          param.from,
          param.to
        ]
      )
    end

    def equal_value_query(param)
      ActiveRecord::Base.sanitize_sql_for_conditions(
        ['v.data ->> ? = ?', param.field_name, param.value]
      )
    end

    def build(args = {})
      super(args) do |result|
        ActiveSupport::JSON.decode(result.first.dig('data') || '{}')
      end
    end
  end
end
