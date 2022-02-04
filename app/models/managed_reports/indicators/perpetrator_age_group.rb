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
          id as record_id
        from incidents
        where data ->>'perpetrator_age_group' is not null
        #{date_range_query(params['incident_date'])&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'])&.prepend('and ')}
        #{equal_value_query(params['module_id'])&.prepend('and ')}
        group by record_id, age_group_id
      }
    end

    def build(args = {})
      super(args) do |results|
        results.map { |result| { 'id' => result['age_group_id'], 'total' => result['total'] } }
      end
    end
  end
end
