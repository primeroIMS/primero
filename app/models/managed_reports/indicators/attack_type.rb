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
        WHERE v.data->>'type' = :violation_type
        and v."data"->>'attack_type' is not null
        #{filter_query(params)}
        group by v."data"->>'attack_type';
      }
    end

    def and_date_range_query(field_name)
      %{
        and to_timestamp(i.data ->> '#{field_name}', 'YYYY-MM-DDTHH\\:\\MI\\:\\SS')
          between :#{field_name}_from and :#{field_name}_to
      }
    end

    def build(args = {})
      super(args, &:to_a)
    end
  end
end
