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
        and v.data->>'verified_ctfmr_technical' = :verified_ctfmr_technical
        and v.data->>'ctfmr_verified' = :ctfmr_verified
        and v."data"->>'attack_type' is not null
        #{filter_query(params)}
        group by v."data"->>'attack_type';
      }
    end
  
    def filter_query(params = [])
      param_names = params.map(&:field_name)
      query = ''
      query += and_date_range_query('date_of_first_report') if param_names.include?('date_of_first_report')
      query += and_date_range_query('date_of_incident') if param_names.include?('incident_date')
      query +=
      query
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
