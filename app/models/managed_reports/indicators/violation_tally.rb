# frozen_string_literal: true

# An indicator that returns the violation_tally of violation type killing
class ManagedReports::Indicators::ViolationTally < ManagedReports::SqlReportIndicator
  class << self
    def id
      'violation'
    end

    # rubocop:disable Metrics/AbcSize
    def sql(_current_user, params = {})
      %{
        select json_object_agg(key, sum) as data
        from (
        select key, sum(value::int)
        from violations violations
        #{incidents_join(params)}
        cross join json_each_text((violations.data->>'violation_tally')::JSON)
        WHERE violations.data->>'violation_tally' is not null
        #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
        #{equal_value_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['verified_ctfmr_technical'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['type'], 'violations')&.prepend('and ')}
        group by key) as violation_data;
      }
    end
    # rubocop:enable Metrics/AbcSize

    def build(current_user = nil, args = {})
      super(current_user, args) do |result|
        ActiveSupport::JSON.decode(result.first.dig('data') || '{}')
      end
    end
  end
end
