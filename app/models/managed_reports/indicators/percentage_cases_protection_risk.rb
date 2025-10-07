# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns % of cases by protection risk
class ManagedReports::Indicators::PercentageCasesProtectionRisk < ManagedReports::SqlReportIndicator
  include ManagedReports::PercentageIndicator
  class << self
    def id
      'percentage_cases_protection_risk'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      date_group_query = build_date_group(params, {}, Child)
      group_id = date_group_query.present? ? 'group_id' : nil
      %(
        WITH protection_assessment_cases AS (
          SELECT
            #{date_group_query&.+(' AS group_id,')}
            srch_protection_risks AS protection_risks,
            COALESCE(srch_gender, 'incomplete_data') AS gender
          FROM cases
          WHERE srch_next_steps && '{a_continue_protection_assessment}'
          #{build_filter_query(current_user, params)&.prepend('AND ')}
        ),
        grouped_cases AS (
          SELECT
            #{group_id&.+(',')}
            gender,
            protection_risks,
            COUNT(*) OVER  #{group_id.present? ? '(PARTITION BY group_id)' : '()'}  AS total_group,
            COUNT(*) OVER (PARTITION BY #{group_id&.+(',') || nil} gender) AS total_gender
          FROM protection_assessment_cases
        )
        SELECT
          #{group_id&.+(',')}
          gender,
          total_gender,
          total_group,
          UNNEST(protection_risks) AS protection_risk,
          COUNT(*) AS count
        FROM grouped_cases
        GROUP BY #{group_id&.+(',')} total_group, total_gender, gender, protection_risk
      )
    end

    # rubocop:enable Metrics/MethodLength
    def build_filter_query(current_user, params = {})
      filters = [
        params['status'],
        ManagedReports::FilterService.reporting_location(params['location']),
        ManagedReports::FilterService.to_datetime(filter_date(params)),
        ManagedReports::FilterService.consent_reporting,
        ManagedReports::FilterService.module_id(params['module_id']),
        ManagedReports::FilterService.scope(current_user)
      ].compact
      return unless filters.present?

      filters.map { |filter| filter.query(Child) }.join(' AND ')
    end

    alias super_build_results build_results
    def build_results(results, params = {})
      super_build_results(results_in_percentages(results.to_a), params)
    end

    def fields
      %w[gender protection_risk]
    end

    def result_map
      { 'key' => 'gender', 'name' => 'protection_risk' }
    end

    def calculate_total_by_fields(fields, results)
      fields.reduce({}) do |memo, field|
        grouped_results = results.group_by { |result| result_group_key(result, field) }
        if field == 'gender'
          memo.merge(grouped_results.transform_values { |values| BigDecimal(values.first['total_gender']) })
        else
          memo.merge(
            grouped_results.transform_values { |values| BigDecimal(values.sum { |value| value['count'] }) }
          )
        end
      end
    end

    def calculate_total_records(results)
      BigDecimal(results.first['total_group'])
    end

    def calculate_total_records_by_group(results)
      results.group_by { |result| result['group_id'] }.transform_values do |values|
        BigDecimal(values.first['total_group'])
      end
    end
  end
end
