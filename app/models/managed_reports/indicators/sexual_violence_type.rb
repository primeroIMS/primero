# frozen_string_literal: true

# An indicator that returns the sexual violence type of violation type rape
class ManagedReports::Indicators::SexualViolenceType < ManagedReports::SqlReportIndicator
  include ManagedReports::MRMIndicatorHelper

  class << self
    def id
      'sexual_violence_type'
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      %{
        select detention_type as name, json_object_agg(key, sum) as data
        #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')}
        from (
        select
        jsonb_array_elements(CAST(violations."data" ->> 'sexual_violence_type' as jsonb)) as detention_type,
        key,
        #{grouped_date_query(params['grouped_by'],
                             filter_date(params),
                             table_name_for_query(params))&.concat(' as group_id,')}
        sum(value::int)
        from violations violations
        cross join json_each_text((violations.data->>'violation_tally')::JSON)
        inner join incidents incidents
          on incidents.id = violations.incident_id
          #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
        where violations.data->>'violation_tally' is not null
        and violations.data->>'sexual_violence_type' is not null
        #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['verified_ctfmr_technical'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['type'], 'violations')&.prepend('and ')}
        group by detention_type, key
        #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')}
        ) as violation_data
        group by detention_type
        #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')}
      }
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity

    def build_data_values(values)
      values.map do |value|
        JSON.parse(value['data']).merge({ 'id' => value['name'].gsub(/"/, '') })
      end
    end
  end
end
