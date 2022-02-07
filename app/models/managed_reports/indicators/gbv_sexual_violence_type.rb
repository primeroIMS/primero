# frozen_string_literal: true

# An indicator that returns the total of incidents grouped by gbv_sexual_violence_type
class ManagedReports::Indicators::GBVSexualViolenceType < ManagedReports::SqlReportIndicator
  class << self
    def id
      'gbv_sexual_violence_type'
    end

    def sql(params = {})
      %{
        select
          data->> 'gbv_sexual_violence_type' as id,
          count(*) as total
        from incidents
        where data->> 'gbv_sexual_violence_type' is not null
        #{date_range_query(params['incident_date'])&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'])&.prepend('and ')}
        #{equal_value_query(params['module_id'])&.prepend('and ')}
        group by data ->> 'gbv_sexual_violence_type'
      }
    end

    def build(args = {})
      super(args, &:to_a)
    end
  end
end
