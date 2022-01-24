# frozen_string_literal: true

# An indicator that returns the total of incidents grouped by elapsed_reporting_time
class ManagedReports::Indicators::ElapsedReportingTime < ManagedReports::SqlReportIndicator
  class << self
    def id
      'elapsed_reporting_time'
    end

    def sql(params = [])
      %{
        select
          data->> 'elapsed_reporting_time' as id,
          count(*) as total
        from incidents
        where data->> 'elapsed_reporting_time' is not null
        #{filter_query(params)}
        group by data ->> 'elapsed_reporting_time'
      }
    end

    def build(args = {})
      super(args, &:to_a)
    end
  end
end
