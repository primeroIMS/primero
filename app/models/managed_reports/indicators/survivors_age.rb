# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the survivors by age
class ManagedReports::Indicators::SurvivorsAge < ManagedReports::SqlReportIndicator
  class << self
    def id
      'age'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/CyclomaticComplexity
    def sql(current_user, params = {})
      date_param = filter_date(params)
      group_query = grouped_date_query(params['grouped_by'], date_param)
      %{
        WITH filtered_incidents AS (
          SELECT
            #{group_query&.dup&.concat(' AS group_id,')}
            CASE
              WHEN srch_age IS NULL THEN ARRAY['incomplete_data']
              WHEN int4range(10, 11, '[]') @> srch_age THEN ARRAY['0 - 11', '10 - 19']
              WHEN int4range(12, 17, '[]') @> srch_age THEN ARRAY['10 - 19', '12 - 17']
              WHEN int4range(0, 11, '[]') @> srch_age THEN ARRAY['0 - 11']
              WHEN int4range(10, 19, '[]') @> srch_age THEN ARRAY['10 - 19']
              WHEN int4range(12, 17, '[]') @> srch_age THEN ARRAY['12 - 17']
              WHEN int4range(50, 999, '[]') @> srch_age THEN ARRAY['50+']
            END AS age_range
          FROM incidents
          WHERE data @? '$[*] ? (@.consent_reporting == "true")'
          #{date_range_query(date_param)&.prepend('AND ')}
          #{equal_value_query(params['module_id'])&.prepend('AND ')}
          #{user_scope_query(current_user)&.prepend('AND ')}
        )
        SELECT
          #{'group_id,' if group_query.present?}
          UNNEST(age_range) AS id,
          COUNT(*) AS total
        FROM filtered_incidents
        GROUP BY #{'group_id,' if group_query.present?} UNNEST(age_range)
      }
    end
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/MethodLength
  end
end
