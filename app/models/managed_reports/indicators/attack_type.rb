# frozen_string_literal: true

# An indicator that returns the attack type of violation type killing
class ManagedReports::Indicators::AttackType < ManagedReports::SqlReportIndicator
  class << self
    def id
      'attack_type'
    end

    def sql(params = [])
      %{
        select v."data"->>'attack_type' as id, count(v.id) as total
        from violations v
        #{incident_join(params)}
        WHERE v."data"->>'attack_type' is not null
        #{filter_query(params)}
        group by v."data"->>'attack_type';
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
