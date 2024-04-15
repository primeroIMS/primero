# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# rubocop:disable Style/ClassAndModuleChildren
module Indicators
  # Class for TransitionIndicator
  class TransitionIndicator < GroupedIndicator
    attr_accessor :transition_model

    def query(indicator_filters, user_query_scope)
      super(indicator_filters, user_query_scope).joins(transitions_join)
    end

    def select_pivots
      select = pivots_to_column_names.map.with_index do |column, index|
        "transitions.#{column} AS pivot#{index + 1}"
      end.join(', ')
      ActiveRecord::Base.sanitize_sql_array(["#{select}, COUNT(*) AS count"] + pivots)
    end

    def transitions_join
      ActiveRecord::Base.sanitize_sql_array(
        [
          %(
            INNER JOIN transitions ON cases.id::VARCHAR = transitions.record_id
            AND transitions.record_type = ? AND transitions.type = ?
          ),
          record_model.name,
          transition_model.name
        ]
      )
    end

    def pivots_to_column_names
      Transition.column_names.select { |column_name| pivots.include?(column_name) }
    end
  end
end
# rubocop:enable Style/ClassAndModuleChildren
