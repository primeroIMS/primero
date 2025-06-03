# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# This filter selects by the transitioned_to field on related transitions.
class SearchFilters::TransitionValue < SearchFilters::Value
  # rubocop:disable Metrics/MethodLength this is pretty much just a long SQL template
  def query(record_class)
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
        EXISTS (
          SELECT 1
          FROM transitions as transitions
          WHERE transitions.type = :transition_type
          AND transitions.record_type = :record_type
          AND #{record_class.table_name}.id = transitions.record_id::uuid
          AND transitions.transitioned_to = :value
        )
        ),
        { transition_type: field_name, record_type: record_class.name, value: }
      ]
    )
  end
  # rubocop:enable Metrics/MethodLength
end
