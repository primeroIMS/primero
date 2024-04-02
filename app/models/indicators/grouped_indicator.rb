# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# rubocop:disable Style/ClassAndModuleChildren
module Indicators
  # Class for Grouped Indicator
  class GroupedIndicator < AbstractIndicator
    # rubocop:enable Style/ClassAndModuleChildren
    attr_accessor :pivots, :pivots_to_query_params, :multivalue_pivots

    DEFAULT_STAT = { 'count' => 0, 'query' => [] }.freeze

    def query(indicator_filters, user_query_scope)
      indicator_query = super(indicator_filters, user_query_scope)
      indicator_query.select(select_pivots).group(pivot_field_names.join(', '))
    end

    def select_pivots
      select = pivots.map.with_index do |pivot, index|
        next("JSONB_ARRAY_ELEMENTS_TEXT(data->?) as pivot#{index + 1}") if multivalue_pivots&.include?(pivot)

        "data->>? AS pivot#{index + 1}"
      end.join(', ')
      ActiveRecord::Base.sanitize_sql_array(["#{select}, COUNT(*) AS count"] + pivots)
    end

    def pivot_field_names
      pivots.map.with_index { |_, index| "pivot#{index + 1}" }
    end

    def write_stats_for_indicator(indicator_filters, user_query_scope)
      indicator_query = query(indicator_filters, user_query_scope)
      result = Child.connection.select_all(indicator_query.to_sql).to_a
      nested_pivots = nested_pivots_from_result(result)
      write_stats_for_pivots(result, indicator_filters, nested_pivots)
    end

    private

    def write_stats_for_pivots(result, indicator_filters, nested_pivots)
      result.each_with_object({}) do |row, memo|
        init_pivot_stats(memo, row, nested_pivots)
        if pivots.size > 1
          memo[row['pivot1']][row['pivot2']] = stats_for_pivots(row, indicator_filters)
        else
          memo[row['pivot1']] = stats_for_pivots(row, indicator_filters)
        end
      end
    end

    def init_pivot_stats(stats, row, nested_pivots)
      return unless stats[row['pivot1']].blank?

      stats[row['pivot1']] = default_pivot_stat(nested_pivots)
    end

    def default_pivot_stat(nested_pivots)
      return DEFAULT_STAT unless nested_pivots.present?

      nested_pivots.reduce({}) { |memo, nested_pivot| memo.merge(nested_pivot => DEFAULT_STAT) }
    end

    def nested_pivots_from_result(result)
      return [] if pivots.size < 2

      result.map { |elem| elem['pivot2'] }.uniq
    end

    def stats_for_pivots(pivot_row, indicator_filters)
      {
        'count' => pivot_row['count'],
        'query' => stat_query_strings(pivot_row, indicator_filters)
      }
    end

    def pivot_values(pivot_row)
      pivot_field_names.map { |elem| pivot_row[elem] }
    end

    def stat_query_strings(pivot_row, indicator_filters)
      indicator_filters.map(&:to_s) + row_pivot_to_query_string(pivot_row)
    end

    def row_pivot_to_query_string(pivot_row)
      values = pivot_values(pivot_row)
      pivots.map.with_index do |pivot, index|
        pivot_param = pivots_to_query_params.present? ? pivots_to_query_params[pivot] : pivot
        "#{pivot_param}=#{values[index]}"
      end
    end
  end
end
