# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# An indicator that returns the number of cases referred to appropriate services
class ManagedReports::Indicators::CaseReferredAppropriateService < ManagedReports::SqlReportIndicator
  class << self
    def id
      'case_referred_appropriate_service'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      date_param = filter_date(params)
      date_group_query = build_date_group_query(params, date_param)
      group_id = date_group_query.present? ? 'group_id' : nil

      <<~SQL
        WITH cases_with_services AS (
          SELECT
            id,
            srch_registration_date  AS registration_date,
            COALESCE(srch_sex, 'incomplete_data') AS sex,
            data->'services_section' AS services_section
          FROM cases
          WHERE data @? '$.services_section ? (@.service_status_referred == true)'
          #{service_implemented_json_query(params['service_implemented'])&.prepend('AND ')}
          #{user_module_query(current_user, 'cases')&.prepend('AND ')}
          #{user_scope_query(current_user, 'cases')&.prepend('AND ')}
          #{params['status']&.query(Child)&.prepend('AND ')}
          #{params['age']&.query(Child)&.prepend('AND ')}
          #{registration_date_filter(date_param)&.prepend('AND ')}
        ),
        cases_with_referred_services AS (
          SELECT
            id,
            #{date_group_query&.+(' AS group_id,')}
            service_type,
            sex
          FROM cases_with_services
          CROSS JOIN LATERAL (
            SELECT
              COALESCE(services->>'service_type', 'incomplete_data') AS service_type,
              COALESCE(services->>'service_implemented', 'incomplete_data') AS service_implemented,
              TO_TIMESTAMP(
                services->>'service_implemented_day_time', 'YYYY-MM-DD'
              ) AS service_implemented_day_time,
              services->'service_status_referred' @? '$[*] ? (@ == true)' AS service_status_referred
            FROM JSONB_ARRAY_ELEMENTS(services_section) AS services
          ) AS referred_services
          WHERE referred_services.service_status_referred = TRUE
          #{service_implemented_query(params['service_implemented'])&.prepend('AND ')}
          #{service_implemented_day_time_filter(date_param)&.prepend('AND ')}
          GROUP BY #{group_id&.+(',')} id, service_type, sex
        )
        SELECT
          #{group_id&.+(',')}
          service_type AS name,
          sex AS key,
          COUNT(*) AS sum,
          CAST(
            SUM(COUNT(*)) OVER (PARTITION BY #{group_id&.+(',')} service_type)
            AS INTEGER
          ) AS total
        FROM cases_with_referred_services
        GROUP BY #{group_id&.+(',')} service_type, sex
      SQL
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity

    def build_date_group_query(params, date_param)
      return unless date_param.present?

      table_name = date_param.field_name == 'registration_date' ? 'cases_with_services' : 'referred_services'
      build_date_group(params, { table_name: })
    end

    def registration_date_filter(date_param)
      return unless date_param&.field_name == 'registration_date'

      date_param.query(Child)
    end

    def service_implemented_day_time_filter(date_param)
      return unless date_param&.field_name == 'service_implemented_day_time'

      plain_date_range_query(date_param, 'referred_services')
    end

    def service_implemented_json_query(service_implemented_param)
      service_implemented = service_implemented_param&.value
      return unless service_implemented.present?

      SearchFilters::TextValue.new(
        field_name: 'services_section.service_implemented', table_name: 'cases', value: service_implemented
      ).query
    end

    def service_implemented_query(service_implemented_param)
      service_implemented = service_implemented_param&.value
      return unless service_implemented.present?

      ActiveRecord::Base.sanitize_sql_for_conditions(['service_implemented = ?', service_implemented])
    end
  end
end
