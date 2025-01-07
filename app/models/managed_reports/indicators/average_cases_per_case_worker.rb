# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the average cases per case worker
class ManagedReports::Indicators::AverageCasesPerCaseWorker < ManagedReports::SqlReportIndicator
  class << self
    def id
      'average_cases_per_case_worker'
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
        WITH protection_cases AS (
          SELECT
            #{date_query&.+(' AS group_id,')}
            data->>'owned_by' AS owned_by,
            data->>'sex' AS sex,
            COUNT(*) AS total_sex
          FROM cases
          #{join_statuses_values}
          #{join_searchable_datetimes}
          #{join_searchable_scope_query}
          WHERE cases.data @? '$[*] ? (@.next_steps == "a_continue_protection_assessment")'
          #{searchable_date_range_query(date_param)&.prepend('AND ')}
          GROUP BY #{group_id&.+(',')} data->>'owned_by', data->>'sex'
        ),
        owners AS (
          SELECT COUNT(DISTINCT owned_by) AS total FROM protection_cases
        ),
        average_cases AS (
          SELECT
            #{group_id&.+(',')}
            owned_by,
            sex,
            total_sex,
            SUM(total_sex) OVER (
              #{group_id ? "PARTITION BY #{group_id}" : nil}
            ) / (SELECT total FROM owners) AS average_owned_by,
            SUM(total_sex) OVER (PARTITION BY #{group_id&.+(',')} sex) / (SELECT total FROM owners) AS average_sex
          FROM protection_cases
        )
        SELECT
         #{group_id&.+(',')}
         'average_cases_per_case_worker' AS name,
         sex AS key,
         ROUND(average_owned_by, 2) AS total,
         ROUND(average_sex, 2) AS sum
        FROM average_cases
      }
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end
