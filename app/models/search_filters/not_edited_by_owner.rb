# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter not_edited_by_owner=value into a sql query
class SearchFilters::NotEditedByOwner < SearchFilters::Value
  # rubocop:disable Metrics/MethodLength
  def query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          (
            (
              data ? 'last_updated_by'
              AND data->>'last_updated_by' IS NOT NULL
              AND (
                (:value = TRUE AND data->>'owned_by' != data->>'last_updated_by')
                OR (:value = FALSE AND data->>'owned_by' = data->>'last_updated_by')
              )
            ) OR (
              (NOT data ? 'last_updated_by' OR data->>'last_updated_by' IS NULL) AND FALSE = :value
            )
          )
        ),
        { value: }
      ]
    )
  end
  # rubocop:enable Metrics/MethodLength

  def field_name
    'not_edited_by_owner'
  end
end
