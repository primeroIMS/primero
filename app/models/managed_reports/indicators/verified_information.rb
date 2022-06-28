# frozen_string_literal: true

# An indicator that returns the type of use of violation type Recruitment
class ManagedReports::Indicators::VerifiedInformation < ManagedReports::SqlReportIndicator
  include ManagedReports::GhnIndicatorHelper

  class << self
    def id
      'verified_information'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      %{
        select key as name, 'total' as key,
        violations.data ->> 'type' as group_id,
        sum(value::int)
        from violations violations
        inner join incidents incidents
          on incidents.id = violations.incident_id
          #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
        cross join json_each_text((violations.data->>'violation_tally')::JSON)
        WHERE violations.data->>'violation_tally' is not null
        #{date_range_query(date_filter_param(params['ghn_date_filter']), 'incidents')&.prepend('and ')}
        and violations.data->>'ctfmr_verified' = 'verified'
        and violations.data ->> 'type' != 'denial_humanitarian_access'
        group by key, violations.data ->> 'type'
        #{grouped_date_query(params['grouped_by'], filter_date(params), table_name_for_query(params))&.prepend(', ')}
        order by
        name
      }
    end
    # rubocop:enable Metrics/MethodLength
  end
end
