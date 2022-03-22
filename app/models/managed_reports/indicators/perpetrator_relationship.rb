# frozen_string_literal: true

# An indicator that returns the total of incidents grouped by perpetrator_relationship
class ManagedReports::Indicators::PerpetratorRelationship < ManagedReports::SqlReportIndicator
  class << self
    def id
      'perpetrator_relationship'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      %{
        select
          alleged_perpetrator.perpetrator_relationship  as relationship_id,
          count(*) as total
        from incidents,
        jsonb_to_recordset(data #> '{alleged_perpetrator}') as alleged_perpetrator(
          age_group text,
          unique_id text,
          primary_perpetrator text,
          perpetrator_sex text,
          former_perpetrator boolean,
          perpetrator_ethnicity text,
          perpetrator_occupation text,
          perpetrator_nationality text,
          perpetrator_relationship text
        )
        where data ->> 'alleged_perpetrator' is not null
        and alleged_perpetrator.primary_perpetrator = 'primary'
        #{date_range_query(params['incident_date'])&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'])&.prepend('and ')}
        #{equal_value_query(params['module_id'])&.prepend('and ')}
        #{user_scope_query(current_user)&.prepend('and ')}
        group by relationship_id
      }
    end
    # rubocop:enable Metrics/MethodLength

    def build(current_user = nil, args = {})
      super(current_user, args) do |results|
        results.map { |result| { 'id' => result['relationship_id'], 'total' => result['total'] } }
      end
    end
  end
end
