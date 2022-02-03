# frozen_string_literal: true

# An indicator that returns the total of incidents with a gbv_sexual_violence_type
class ManagedReports::Indicators::TotalGBVSexualViolence < ManagedReports::SqlReportIndicator
  class << self
    def id
      'gbv_sexual_violence'
    end

    def sql(_current_user, params = [])
      %{
        select
          count(*) as total
        from  incidents
        where data ->> 'gbv_sexual_violence_type' != 'non-gbv'
        and data ->> 'gbv_sexual_violence_type' is not null
        #{filter_query(params)}
      }
    end

    def build(current_user = nil, args = {})
      super(current_user, args) { |results| results[0]['total'] }
    end
  end
end
