# frozen_string_literal: true

# An indicator that returns the factor of recruitment of violation type Recruitment
class ManagedReports::Indicators::FactorsOfRecruitment < ManagedReports::SqlReportIndicator
  include ManagedReports::MRMIndicatorHelper

  class << self
    def id
      'factors_of_recruitment'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      %{
        select name, json_object_agg(key, sum) as data
        #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')}
        from (
          select
          jsonb_array_elements(CAST(violations."data" ->> 'factors_of_recruitment' as jsonb)) as name,
          key,
          #{grouped_date_query(params['grouped_by'],
                               filter_date(params),
                               table_name_for_query(params))&.concat(' as group_id,')}
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
          #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')}
        ) as factors_data
        group by name
        #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')}
      }
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity

    def build_data_values(values)
      values.map do |value|
        JSON.parse(value['data']).merge({ 'id' => value['name'].gsub('"', '') })
      end
    end
  end
end
