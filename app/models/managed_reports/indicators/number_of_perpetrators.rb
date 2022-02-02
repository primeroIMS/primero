# frozen_string_literal: true

# An indicator that returns the total of incidents grouped by the number_of_perpetrators
class ManagedReports::Indicators::NumberOfPerpetrators < ManagedReports::SqlReportIndicator
  class << self
    def id
      'number_of_perpetrators'
    end

    def sql(params = [])
      %{
        select
          data ->>'number_of_perpetrators' as id,
          count(*) as total
        from incidents
        where data ->>'number_of_perpetrators' is not null
        #{filter_query(params)}
        group by data ->>'number_of_perpetrators'
      }
    end

    def build(args = {})
      super(args, &:to_a)
    end
  end
end
