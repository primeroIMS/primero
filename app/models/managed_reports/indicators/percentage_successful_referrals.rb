# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the percentage of successful referrals
class ManagedReports::Indicators::PercentageSuccessfulReferrals < ManagedReports::SqlReportIndicator
  DATE_PARAM_CONFIG = {
    'referral_created_at' => { table_name: 'referrals', field_name: 'created_at' },
    'service_response_day_time' => { table_name: 'services', field_name: 'service_response_day_time' }
  }.freeze

  class << self
    def id
      'percentage_successful_referrals'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    def sql(current_user, params = {})
      date_param = filter_date(params)
      date_query = service_date_query(params['grouped_by'], date_param)
      group_id = date_query.present? ? 'group_id' : nil
      %(
        WITH services AS (
          SELECT
            service_status_referred,
            service_response_day_time,
            service_implemented,
            service_unique_id,
            COALESCE(srch_gender, 'incomplete_data') AS gender,
            cases.id AS case_id
          FROM cases
          #{join_services(params['service_type'])}
          WHERE data @? '$.services_section ? (@.service_status_referred == true)'
          #{build_filter_query(current_user, params)&.prepend('AND ')}
        ),
        referred_services AS (
          SELECT
            #{date_query&.+(' AS group_id,')}
            gender,
            service_implemented
          FROM services
          #{join_referrals(date_param)}
          #{service_response_day_time_query(date_param)&.prepend('WHERE ')}
        )
        SELECT
          #{group_id&.+(',')}
          gender AS key,
          service_implemented AS name,
          ROUND(COUNT(*) * 100 / SUM(COUNT(*)) OVER (PARTITION BY #{group_id&.+(',')} gender), 2) AS sum,
          ROUND(
            SUM(COUNT(*)) OVER (
              PARTITION BY #{group_id&.+(',')} service_implemented
            ) * 100 / SUM(COUNT(*)) OVER (#{group_id&.dup&.prepend('PARTITION BY ')}),
           2
          ) AS total
        FROM referred_services
        GROUP BY #{group_id&.+(',')} gender, service_implemented
        ORDER BY service_implemented
      )
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize

    def build_filter_query(current_user, params = {})
      filters = [
        params['status'],
        ManagedReports::FilterService.reporting_location(params['location']),
        ManagedReports::FilterService.consent_reporting,
        ManagedReports::FilterService.module_id(params['module_id']),
        ManagedReports::FilterService.scope(current_user)
      ].compact
      return unless filters.present?

      filters.map { |filter| filter.query(Child) }.join(' AND ')
    end

    def service_date_query(grouped_by, date_param)
      return unless date_param&.field_name.present?

      config = DATE_PARAM_CONFIG[date_param.field_name]
      return unless config.present?

      grouped_date_query(grouped_by, date_param, config[:table_name], nil, config[:field_name])
    end

    def service_response_day_time_query(date_param)
      return unless date_param.present? && date_param.field_name == 'service_response_day_time'

      date_range_query(date_param, 'services', nil, 'service_response_day_time')
    end

    # rubocop:disable Metrics/MethodLength
    def join_services(service_type_param = nil)
      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          %(
            CROSS JOIN LATERAL (
              SELECT
                services_section->>'service_status_referred' AS service_status_referred,
                TO_TIMESTAMP(services_section->>'service_response_day_time', :format) AS service_response_day_time,
                services_section->>'service_implemented' AS service_implemented,
                services_section->>'unique_id' AS service_unique_id
              FROM JSONB_ARRAY_ELEMENTS(data->'services_section') AS services_section
              WHERE services_section @? '$[*]
                ? (@.service_status_referred == true)
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

    # rubocop:disable Metrics/MethodLength
    def join_referrals(date_param)
      return unless date_param.present? && date_param.field_name == 'referral_created_at'

      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          %(
            INNER JOIN (
              SELECT
                record_id,
                service_record_id,
                created_at
              FROM transitions
              WHERE record_type = 'Child'
              AND type = 'Referral'
              AND created_at >= to_timestamp(:from, :date_format)
              AND created_at <= (to_timestamp(:to, :date_format) + interval '1 day' - interval '1 second')
            ) AS referrals
            ON referrals.service_record_id = service_unique_id
	          AND UUID(referrals.record_id) = services.case_id
          ),
          { from: date_param.from, to: date_param.to, date_format: Report::DATE_TIME_FORMAT }
        ]
      )
    end
    # rubocop:enable Metrics/MethodLength
  end
end
