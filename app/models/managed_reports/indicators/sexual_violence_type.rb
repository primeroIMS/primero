# frozen_string_literal: true

# An indicator that returns the sexual violence type of violation type rape
class ManagedReports::Indicators::SexualViolenceType < ManagedReports::SqlReportIndicator
  class << self
    def id
      'sexual_violence_type'
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    def sql(_current_user, params = {})
      %{
        select detention_type, json_object_agg(key, sum) as data
        from (
        select
        jsonb_array_elements(CAST(violations."data" ->> 'sexual_violence_type' as jsonb)) as detention_type,
        key,
        sum(value::int)
        from violations violations
        cross join json_each_text((violations.data->>'violation_tally')::JSON)
        #{incidents_join(params)}
        where violations.data->>'violation_tally' is not null
        and violations.data->>'sexual_violence_type' is not null
        #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['verified_ctfmr_technical'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['type'], 'violations')&.prepend('and ')}
        group by detention_type, key
        ) as violation_data
        group by detention_type;
      }
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength

    def build(current_user = nil, args = {})
      super(current_user, args) do |result|
        result.map do |elem|
          values = JSON.parse(elem['data'])
          values[:id] = elem['detention_type'].gsub(/"/, '')
          values
        end
      end
    end
  end
end
