# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter not_edited_by_owner=value into a sql query
class SearchFilters::TransitionToUserGroups < SearchFilters::ValueList
  attr_accessor :record_type

  # rubocop:disable Metrics/MethodLength
  def query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          EXISTS (
            SELECT 1
            FROM user_groups
            INNER JOIN user_groups_users ON user_groups_users.user_group_id = user_groups.id
            INNER JOIN users ON users.id = user_groups_users.user_id
            WHERE users.user_name IN (
              SELECT transitioned_to
              FROM transitions
              WHERE transitions.record_id = cases.id::varchar
              AND transitions.record_type = :record_type
              AND transitions.type = :transition_type
            )
            AND user_groups.unique_id IN (:values)
          )
        ),
        { values:, transition_type:, record_type: }
      ]
    )
  end
  # rubocop:enable Metrics/MethodLength

  def transition_type
    raise NotImplementedError
  end
end
