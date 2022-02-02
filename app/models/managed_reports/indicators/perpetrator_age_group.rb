# frozen_string_literal: true

# An indicator that returns the total of incidents grouped by the perpetrator_age_group
class ManagedReports::Indicators::PerpetratorAgeGroup < ManagedReports::SqlReportIndicator
  class << self
    def id
      'perpetrator_age_group'
    end

    def sql(params = [])
      %{
        select
          jsonb_array_elements_text(data #> '{perpetrator_age_group}') as age_group_id,
          count(*) as total
        from incidents
        where data ->>'perpetrator_age_group' is not null
        #{filter_query(params)}
        group by age_group_id
      }
    end

    def build(args = {})
      super(args) do |results|
        results.map { |result| { id: result['age_group_id'], total: result['total'] } }
      end
    end
  end
end
