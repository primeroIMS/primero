# frozen_string_literal: true

# An indicator that returns the violation_tally of violation type killing
class ManagedReports::Indicators::ViolationTallyDetention < ManagedReports::SqlReportIndicator
  class << self
    def id
      'violation'
    end

    def sql(_current_user, params = [])
      %{
        select json_object_agg(key, sum) as data from(
          select key, SUM(value::INTEGER) from (
              select distinct on(violations.id, key) key, value
              from individual_victims iv
              inner join individual_victims_violations ivv on ivv.individual_victim_id = iv.id
              inner join violations violations on violations.id = ivv.violation_id
              #{incident_join(params)}
              cross join json_each_text((violations."data"->>'violation_tally')::JSON)
              where (iv.data->>'victim_deprived_liberty_security_reasons')::boolean
              #{filter_query(params)}
              and violations."data"->>'violation_tally' is not null
          ) keys_values
          group by key
      ) as deprived_data;
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

    def build(current_user = nil, args = {})
      super(current_user, args) do |result|
        ActiveSupport::JSON.decode(result.first.dig('data') || '{}')
      end
    end
  end
end
