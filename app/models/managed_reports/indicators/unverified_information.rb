# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the type of use of violation type Recruitment
class ManagedReports::Indicators::UnverifiedInformation < ManagedReports::SqlReportIndicator
  include ManagedReports::GhnIndicatorHelper

  class << self
    def id
      'unverified_information'
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
        and violations.data->>'ctfmr_verified' = 'report_pending_verification'
        and violations.data ->> 'type' != 'denial_humanitarian_access'
        group by key, violations.data ->> 'type'
        order by
        name
      }
    end
    # rubocop:enable Metrics/MethodLength

    def date_filter
      'incident_date'
    end

    def build_results(results, params = {})
      super(results, params).map { |result| group_with_query(result, params) }
    end

    def query_for_group(group, _params)
      return [] if group[:group_id] == 'total'

      ["child_types=#{group[:group_id]}"]
    end

    def query_for_result(result, params)
      date_param = date_filter_param(params['ghn_date_filter'])
      [
        "violation_with_verification_status=#{result[:id]}_report_pending_verification",
        date_param.to_s
      ]
    end
  end
end
