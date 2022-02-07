# frozen_string_literal: true

# An indicator that returns the perpetators of violation type killing
class ManagedReports::Indicators::PerpetratorsDetention < ManagedReports::SqlReportIndicator
  class << self
    def id
      'perpetrators'
    end

    def sql(_current_user, params = [])
      %{
        select p."data"->>'armed_force_group_party_name' as id, count(pv.violation_id) as total
        from violations violations
        inner join perpetrators_violations pv on pv.violation_id = violations.id
        inner join individual_victims_violations ivv on violations .id = ivv.violation_id
        inner join individual_victims iv on ivv.individual_victim_id = iv.id
        inner join perpetrators p on p.id = pv.perpetrator_id
        #{incident_join(params)}
        WHERE p.data->>'armed_force_group_party_name' is not null
        and (iv.data->>'victim_deprived_liberty_security_reasons')::boolean
        #{filter_query(params)}
        group by p."data"->>'armed_force_group_party_name';
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
      super(current_user, args, &:to_a)
    end
  end
end
