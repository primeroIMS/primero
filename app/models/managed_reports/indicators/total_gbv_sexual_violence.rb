# frozen_string_literal: true

# An indicator that returns the total of incidents grouped by gbv_sexual_violence_type
class ManagedReports::Indicators::TotalGBVSexualViolence < ManagedReports::SqlReportIndicator
  class << self
    def id
      'gbv_sexual_violence'
    end

    def sql(params = [])
      %{
        select
          count(*) as total
        from  incidents
        where data ->> 'gbv_sexual_violence_type' != 'non_gbv'
        and data ->> 'gbv_sexual_violence_type' is not null
        #{filter_query(params)}
      }
    end

    def build(args = {})
      super(args) { |results| results[0]['total'] }
    end
  end
end
