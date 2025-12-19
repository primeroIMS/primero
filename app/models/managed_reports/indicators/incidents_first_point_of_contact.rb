# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the total of incidents where the organization is the first point of contact
class ManagedReports::Indicators::IncidentsFirstPointOfContact < ManagedReports::SqlReportIndicator
  class << self
    def id
      'incidents_first_point_of_contact'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      date_param = filter_date(params)
      <<~SQL
        SELECT
          'incidents' AS id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' AS group_id,')}
          COUNT(*) AS total
        FROM incidents
        WHERE srch_record_state = TRUE
        AND data @? '$[*] ? (
          @.consent_reporting  == "true" && @.service_referred_from == "self_referral"
        ) ? (
          !exists(@.gbv_reported_elsewhere) || @.gbv_reported_elsewhere != "gbvims-org"
        )'
        #{user_scope_query(current_user)&.prepend('AND ')}
        #{date_range_query(date_param)&.prepend('AND ')}
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend('GROUP BY ')}
      SQL
    end
    # rubocop:enable Metrics/MethodLength
  end
end
