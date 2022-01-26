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
        select i."data"->>'incident_location' as id, count(v.id) as total
        from violations v
        inner join incidents i on i.id = v.incident_id
        WHERE v.data->>'type' = :violation_type
        and v.data->>'verified_ctfmr_technical' = :verified_ctfmr_technical
        and v.data->>'ctfmr_verified' = :ctfmr_verified
        #{filter_query(params)}
        group by i."data"->>'incident_location';
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
