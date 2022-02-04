# frozen_string_literal: true

# An indicator that returns the total of incidents grouped by the perpetrator_occupation
class ManagedReports::Indicators::PerpetratorOccupation < ManagedReports::SqlReportIndicator
  class << self
    def id
      'perpetrator_occupation'
    end

    def sql(params = [])
      %{
        select
          jsonb_array_elements_text(data #> '{perpetrator_occupation}') as occupation_id,
          count(*) as total
        from incidents
        where data ->>'perpetrator_occupation' is not null
        #{date_range_query(params['incident_date'])&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'])&.prepend('and ')}
        #{equal_value_query(params['module_id'])&.prepend('and ')}
        group by occupation_id
      }
    end

    def build(args = {})
      super(args) do |results|
        results.map { |result| { 'id' => result['occupation_id'], 'total' => result['total'] } }
      end
    end
  end
end
