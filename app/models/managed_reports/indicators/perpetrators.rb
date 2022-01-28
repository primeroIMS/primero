# frozen_string_literal: true

# An indicator that returns the perpetators of violation type killing
class ManagedReports::Indicators::Perpetrators < ManagedReports::SqlReportIndicator
  class << self
    def id
      'perpetrators'
    end

    def sql(params = [])
      %{
        select p."data"->>'armed_force_group_party_name' as id, count(pv.violation_id) as total
        from violations v
        inner join perpetrators_violations pv on pv.violation_id = v.id
        #{incident_join(params)}
        inner join perpetrators p on p.id = pv.perpetrator_id
        WHERE p.data->>'armed_force_group_party_name' is not null
        #{filter_query(params)}
        group by p."data"->>'armed_force_group_party_name';
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
      super(args, &:to_a)
    end
  end
end
