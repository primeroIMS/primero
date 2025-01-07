# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns % of clients less impacted by protection risks after receiving support
class ManagedReports::Indicators::LessImpactedAfterSupport < ManagedReports::SqlReportIndicator
  class << self
    def id
      'less_impacted_after_support'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      date_param = filter_date(params)
      date_query = grouped_date_query(params['grouped_by'], date_param, 'searchable_datetimes', nil, 'value')
      group_id = date_query.present? ? 'group_id' : nil
      join_searchable_datetimes = if date_param.present?
                                    %(
                                      INNER JOIN searchable_datetimes searchable_datetimes
                                      ON cases.id = searchable_datetimes.record_id
                                      AND searchable_datetimes.record_type = 'Child'
                                    )
                                  end

      status_query = searchable_equal_value_multiple(params['status'])
      join_statuses_values = if status_query.present?
                               %(
                                INNER JOIN (
                                  SELECT
                                    record_id
                                  FROM searchable_values
                                  WHERE searchable_values.record_type = 'Child'
                                  AND #{status_query}
                                ) AS statuses ON statuses.record_id = cases.id
                              )
                             end

      scope_query = searchable_user_scope_query(current_user)

      join_searchable_scope_query = if scope_query.present?
                                      %(
                                        INNER JOIN (
                                          SELECT
                                            DISTINCT(record_id)
                                          FROM searchable_values
                                          WHERE searchable_values.record_type = 'Child'
                                          AND #{scope_query}
                                        ) AS scope_ids ON scope_ids.record_id = cases.id
                                      )
                                    end
      %{
        WITH impacted_ranges AS (
          SELECT
            #{date_query&.+(' AS group_id,')}
            CAST(data->>'closure_problems_severity' AS INTEGER) AS closure_problems_severity,
            CAST(data->>'client_summary_worries_severity' AS INTEGER) AS client_summary_worries_severity,
            CASE WHEN CAST(
              data->>'closure_problems_severity' AS INTEGER
            ) < CAST(data->>'client_summary_worries_severity' AS INTEGER)
            THEN 'clients_report_less_impacted'
            ELSE 'clients_report_equally_or_more_severely_impacted'
            END AS impact_range,
            data->>'sex' AS sex
          FROM cases
          #{join_statuses_values}
          #{join_searchable_datetimes}
          #{join_searchable_scope_query}
          WHERE (
            cases.data @? '$[*]
              ? (@.next_steps == "a_continue_protection_assessment")
              ? (@.client_summary_worries_severity like_regex "[0-9]")
              ? (@.closure_problems_severity like_regex "[0-9]")'
          )
          #{searchable_date_range_query(date_param)&.prepend('AND ')}
        ),
        percentages AS (
          SELECT
            impact_range,
            #{group_id&.+(', ')}
            sex,
            COUNT(*) * 100 / SUM(COUNT(*)) OVER (PARTITION BY #{group_id&.+(',')} sex) AS percentage,
            SUM(COUNT(*)) OVER (PARTITION BY #{group_id&.+(',')} impact_range) AS total_impact,
            SUM(COUNT(*)) OVER (#{group_id&.dup&.prepend('PARTITION BY ')}) AS total
          FROM impacted_ranges
          GROUP BY #{group_id&.+(',')} impact_range, sex
        )
        SELECT
          impact_range AS name,
          sex AS key,
          #{group_id&.+(', ')}
          ROUND(percentage, 2) AS sum,
          ROUND((total_impact * 100) / total, 2) AS total
        FROM percentages
      }
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end
