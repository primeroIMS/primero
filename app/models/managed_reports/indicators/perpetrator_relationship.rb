# frozen_string_literal: true

# An indicator that returns the total of incidents grouped by perpetrator_relationship
class ManagedReports::Indicators::PerpetratorRelationship < ManagedReports::SqlReportIndicator
  class << self
    def id
      'perpetrator_relationship'
    end

    def sql(params = [])
      %{
        select
          jsonb_array_elements_text(data #> '{perpetrator_relationship}') as relationship_id,
          count(*) as total
        from incidents
        where data ->>'perpetrator_relationship' is not null
        #{date_range_query(params['incident_date'])&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'])&.prepend('and ')}
        group by relationship_id
      }
    end

    def build(args = {})
      super(args) do |results|
        results.map { |result| { 'id' => result['relationship_id'], 'total' => result['total'] } }
      end
    end
  end
end
