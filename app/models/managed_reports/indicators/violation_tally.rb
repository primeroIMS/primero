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
        WHERE v.data->>'type' = :violation_type
        and v.data->>'verified_ctfmr_technical' = :verified_ctfmr_technical
        and v.data->>'ctfmr_verified' = :ctfmr_verified
        #{filter_query(params)}
        group by key) as violation_data;
      }
    end

    def and_date_range_query(field_name)
      %{
        and to_timestamp(i.data ->> '#{field_name}', 'YYYY-MM-DDTHH\\:\\MI\\:\\SS')
          between :#{field_name}_from and :#{field_name}_to
      }
    end

    def build(args = {})
      super(args) do |result|
        ActiveSupport::JSON.decode(result.first.dig('data') || '{}')
      end
    end
  end
end
