# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Base class to filter records by transitioned_to
class SearchFilters::TransitionUsers < SearchFilters::Value
  attr_accessor :record_type

  # rubocop:disable Metrics/MethodLength
  def query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          EXISTS (
            SELECT 1 FROM transitions WHERE transitions.record_id = cases.id::varchar
            AND transitions.transitioned_to = :value AND transitions.record_type = :record_type
            AND transitions.type = :transition_type
          )
        ),
        { value:, transition_type:, record_type: }
      ]
    )
  end
  # rubocop:enable Metrics/MethodLength

  def transition_type
    raise NotImplementedError
  end
end
