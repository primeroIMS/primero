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
        #{filter_query(params)}
        group by relationship_id
      }
    end

    def build(args = {})
      super(args) do |results|
        results.map { |result| { id: result['relationship_id'], total: result['total'] } }
      end
    end
  end
end
