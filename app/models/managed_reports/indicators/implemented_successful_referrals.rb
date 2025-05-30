# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the implemented referrals
class ManagedReports::Indicators::ImplementedSuccessfulReferrals < ManagedReports::SqlReportIndicator
  class << self
    def id
      'implemented_successful_referrals'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      date_param = filter_date(params)
      date_query = grouped_service_implemented_day_time(params['grouped_by'], date_param)
      group_id = date_query.present? ? 'group_id' : nil

      %(
        WITH implemented_services AS (
          SELECT
              #{date_query&.+(' AS group_id,')}
              service_status_referred,
              service_implemented_day_time,
              service_unique_id,
              service_type,
              service_implemented,
              COALESCE(srch_gender, 'incomplete_data') AS gender,
              srch_owned_by_location AS owned_by_location,
              cases.id AS case_id
            FROM cases
            #{join_services(params['service_type'])}
            WHERE 1 = 1
            #{build_filter_query(current_user, params)&.prepend('AND ')}
            #{date_range_query(date_param, 'services', nil, 'service_implemented_day_time')&.prepend('AND ')}
        )
        SELECT
          #{group_id&.+(',')}
          service_implemented AS name,
          gender AS key,
          COUNT(*) AS sum,
          SUM(COUNT(*)) OVER (#{group_id&.dup&.prepend('PARTITION BY ')}) AS total
        FROM implemented_services
        GROUP BY #{group_id&.+(',')} service_implemented, gender
      )
    end
    # rubocop:enable Metrics/MethodLength

    def build_filter_query(current_user, params = {})
      filters = [
        params['status'],
        ManagedReports::FilterService.consent_reporting,
        ManagedReports::FilterService.module_id(params['module_id']),
        ManagedReports::FilterService.scope(current_user),
        ManagedReports::FilterService.reporting_location(params['location'])
      ].compact
      return unless filters.present?

      filters.map { |filter| filter.query(Child) }.join(' AND ')
    end

    # rubocop:disable Metrics/MethodLength
    def join_services(service_type_param = nil)
      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          %(
            CROSS JOIN LATERAL (
              SELECT
                services_section->>'service_status_referred' AS service_status_referred,
                TO_TIMESTAMP(
                  services_section->>'service_implemented_day_time', :format
                ) AS service_implemented_day_time,
                services_section->>'unique_id' AS service_unique_id,
                services_section->>'service_type' AS service_type,
                services_section->>'service_implemented' AS service_implemented
              FROM JSONB_ARRAY_ELEMENTS(data->'services_section') AS services_section
              WHERE services_section @? '$[*]
                ? (@.service_status_referred == true)
                ? (@.service_implemented == "implemented")
                #{filter_service_type(service_type_param&.value)&.prepend('? ')}'
            ) AS services
           ),
          { format: Report::DATE_TIME_FORMAT }
        ]
      )
    end
    # rubocop:enable Metrics/MethodLength

    def filter_service_type(service_type)
      return unless service_type.present?

      ActiveRecord::Base.sanitize_sql_for_conditions(['(@.service_type == "%s")', service_type])
    end

    def grouped_service_implemented_day_time(grouped_by, date_param)
      return unless date_param.present?

      grouped_date_query(grouped_by, date_param, 'services', nil, 'service_implemented_day_time')
    end

    def service_implemented_day_time_query(date_param)
      return unless date_param.present?

      date_range_query(date_param, 'services', nil, 'service_implemented_day_time')
    end
  end
end
