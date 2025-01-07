# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the total of incidents
class ManagedReports::Indicators::TotalProtectionManagementCases < ManagedReports::SqlReportIndicator
  class << self
    def id
      'total_protection_management_cases'
    end

    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
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
      join_statuses_values = %(
                                INNER JOIN searchable_values
                                ON cases.id = searchable_values.record_id
                                AND searchable_values.record_type = 'Child'
                                AND searchable_values.field_name = 'status'
                              )

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
            data->>'sex' AS key,
            searchable_values.value AS name
          FROM cases
          #{join_statuses_values}
          #{join_searchable_datetimes}
          #{join_searchable_scope_query}
          WHERE
            cases.data @? '$[*] ? (@.next_steps == "a_continue_protection_assessment")'
            #{searchable_date_range_query(date_param)&.prepend('AND ')}
            #{status_query&.prepend('AND ')}
        )
        SELECT
          key,
          name,
          #{group_id&.+(',')}
          COUNT(*) AS sum,
          SUM(COUNT(*)) OVER (PARTITION BY #{group_id&.+(',')} name)::INT AS total
        FROM protection_cases
        GROUP BY #{group_id&.+(',')} key, name
      }
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
  end
end
