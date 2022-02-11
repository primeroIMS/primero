# frozen_string_literal: true

# An indicator that returns the total of incidents with a gbv_sexual_violence_type
class ManagedReports::Indicators::TotalGBVSexualViolence < ManagedReports::SqlReportIndicator
  class << self
    def id
      'gbv_sexual_violence'
    end

    def sql(params = {})
      %{
        select
          count(*) as total
        from  incidents
        where data ->> 'gbv_sexual_violence_type' != 'non-gbv'
        and data ->> 'gbv_sexual_violence_type' is not null
        #{date_range_query(params['incident_date'])&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'])&.prepend('and ')}
        #{equal_value_query(params['module_id'])&.prepend('and ')}
      }
    end

    def build(args = {})
      super(args) { |results| results[0]['total'] }
    end
  end
end
