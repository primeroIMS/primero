# frozen_string_literal: true

# An indicator that returns the total of incidents grouped by gbv_sexual_violence_type
class ManagedReports::Indicators::GBVSexualViolenceType < ManagedReports::SqlReportIndicator
  class << self
    def id
      'gbv_sexual_violence_type'
    end

    def sql(_current_user, params = [])
      %{
        select
          data->> 'gbv_sexual_violence_type' as id,
          count(*) as total
        from incidents
        where data->> 'gbv_sexual_violence_type' is not null
        #{filter_query(params)}
        group by data ->> 'gbv_sexual_violence_type'
      }
    end

    def build(current_user, args = {})
      super(current_user, args, &:to_a)
    end
  end
end
