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
        WHERE v.data->>'type' = :violation_type
        and v.data->>'verified_ctfmr_technical' = :verified_ctfmr_technical
        and v.data->>'ctfmr_verified' = :ctfmr_verified
        #{filter_query(params)}
        group by p."data"->>'armed_force_group_party_name';
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
