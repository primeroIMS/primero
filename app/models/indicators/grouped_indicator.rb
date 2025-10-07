# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# rubocop:disable Style/ClassAndModuleChildren
module Indicators
  # Class for Grouped Indicator
  class GroupedIndicator < AbstractIndicator
    # rubocop:enable Style/ClassAndModuleChildren
    attr_accessor :pivots, :indicator_pivots

    DEFAULT_STAT = { 'count' => 0, 'query' => [] }.freeze

    def initialize(args = {})
      super(args)
      self.indicator_pivots = build_indicator_pivots
    end

    def query(indicator_filters, user_query_scope)
      build_query(indicator_filters, user_query_scope).select(select_pivots).group(pivot_names.join(', '))
    end

    def build_indicator_pivots
      pivots.map.with_index(1) do |pivot, index|
        if record_model.searchable_field_names.include?(pivot[:field_name])
          searchable_column_name = record_model.searchable_column_name(pivot[:field_name])
          next SearchablePivot.new(pivot.merge(number: index, searchable_column_name:))
        end

        JsonPivot.new(pivot.merge(number: index))
      end
    end

    def select_pivots
      select = indicator_pivots.map(&:select).join(', ')
      "#{select}, COUNT(*) AS count"
    end

    def pivot_names
      indicator_pivots.map(&:name)
    end

    def write_stats_for_indicator(indicator_filters, user_query_scope, managed_user_names = [])
      indicator_query = query(indicator_filters, user_query_scope)
      indicator_query = join_and_constraint_pivots(indicator_query, managed_user_names)
      indicator_query = indicator_query.order(pivot_names)
      result = Child.connection.select_all(indicator_query.to_sql).to_a
      nested_pivots = nested_pivots_from_result(result)
      write_stats_for_pivots(result, indicator_filters, nested_pivots)
    end

    protected

    def join_and_constraint_pivots(indicator_query, managed_user_names)
      indicator_pivots.each do |pivot|
        indicator_query = pivot.join_multivalue(indicator_query) if pivot.multivalue?
        indicator_query = pivot.join_location_pivot(indicator_query) if pivot.location?
        next unless pivot.constrained? && managed_user_names.present?

        indicator_query = pivot.constraint_values(indicator_query, managed_user_names)
      end

      indicator_query
    end

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
      { 'count' => pivot_row['count'], 'query' => stat_query_strings(pivot_row, indicator_filters) }
    end

    def stat_query_strings(pivot_row, indicator_filters)
      indicator_filters.map(&:to_s) + row_pivot_to_query_string(pivot_row)
    end

    def row_pivot_to_query_string(pivot_row)
      indicator_pivots.map.with_index { |pivot, _index| "#{pivot.to_param}=#{pivot_row[pivot.name]}" }
    end
  end
end
