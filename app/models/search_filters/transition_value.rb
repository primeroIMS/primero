# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# This filter selects by the transitioned_to field on related transitions.
class SearchFilters::TransitionValue < SearchFilters::Value
  def query(record_class) # rubocop:disable Metrics/MethodLength this is pretty much just a long SQL template
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
        EXISTS (
          SELECT 1
          FROM transitions as transitions
          WHERE transitions.type = :transition_type
          AND #{record_class.table_name}.id::varchar = transitions.record_id
          AND transitions.transitioned_to = :value
        )
        ),
        { transition_type: field_name, record_class:, value: }
      ]
    )
  end
end

# AND id = transitions.record_id
