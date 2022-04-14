# frozen_string_literal: true

# An indicator that returns the factor of recruitment of violation type Recruitment
class ManagedReports::Indicators::FactorsOfRecruitment < ManagedReports::SqlReportIndicator
  class << self
    def id
      'factors_of_recruitment'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    def sql(current_user, params = {})
      %{
        select name, json_object_agg(key, sum) as data
        from (
          select
          jsonb_array_elements(CAST(violations."data" ->> 'factors_of_recruitment' as jsonb)) as name,
          key,
          sum(value::int)
          from violations violations
          inner join incidents incidents
            on incidents.id = violations.incident_id
            #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
          cross join json_each_text((violations."data"->>'violation_tally')::JSON)
          where violations.data->>'violation_tally' is not null
          and violations."data"->>'factors_of_recruitment' is not null
          #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
          #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
          #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
          #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
          #{equal_value_query(params['type'], 'violations')&.prepend('and ')}
          group by name, key
        ) as factors_data
        group by name;
      }
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity

    def build(current_user = nil, args = {})
      super(current_user, args) do |result|
        result.map do |elem|
          values = JSON.parse(elem['data'])
          values['id'] = elem['name'].gsub(/"/, '')
          values
        end
      end
    end
  end
end
