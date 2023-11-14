# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Class to hold SQL results
class ManagedReports::SqlReportIndicator < ValueObject
  include ManagedReports::SqlQueryHelpers

  attr_accessor :params, :data

  QUARTER = 'quarter'
  MONTH = 'month'
  YEAR = 'year'
  WEEK = 'week'

  class << self
    def sql(current_user, params = {}); end

    def build(current_user = nil, params = {})
      indicator = new(params:)
      results = indicator.execute_query(current_user)
      indicator.data = block_given? ? yield(results) : build_results(results, params)
      indicator
    end

    def build_results(results, params = {})
      results_array = results.to_a

      return results_array unless results_array.any? { |result| result['group_id'].present? }

      build_groups(results_array, params)
    end

    def build_ranges(params = {})
      grouped_by_param = params['grouped_by']
      date_param = filter_date(params)

      return unless grouped_by_param.present? && date_param.present?

      range_by_group(grouped_by_param.value, date_param.from.to_date..date_param.to.to_date)
    end

    def range_by_group(grouped_by_value, date_range)
      case grouped_by_value
      when QUARTER then date_range.map { |date| "#{date.year}-Q#{(date.month / 3.0).ceil}" }.uniq
      when MONTH then date_range.map { |date| "#{date.year}-#{date.strftime('%m')}" }.uniq
      else date_range.map(&:year).uniq
      end
    end

    def build_groups(results, params = {})
      build_ranges(params).map do |current_range|
        values_range = results.select { |result| result['group_id'] == current_range }

        {
          group_id: current_range,
          data: build_data_values(values_range)
        }
      end
    end

    def build_data_values(values)
      values.each_with_object([]) do |curr, acc|
        curr.delete('group_id')

        acc << curr
      end
    end

    def user_scope_query(current_user, table_name = nil)
      return if current_user.blank? || current_user.managed_report_scope_all?

      if current_user.managed_report_scope == Permission::AGENCY
        agency_scope_query(current_user, table_name)
      elsif current_user.managed_report_scope == Permission::GROUP
        group_scope_query(current_user, table_name)
      else
        self_scope_query(current_user, table_name)
      end
    end

    def grouped_date_query(grouped_by_param, date_param, table_name = nil, hash_field = 'data', map_to = nil)
      return unless grouped_by_param.present? && date_param.present?

      case grouped_by_param.value
      when QUARTER then grouped_quarter_query(date_param, table_name, hash_field, map_to)
      when MONTH then grouped_month_query(date_param, table_name, hash_field, map_to)
      else grouped_year_query(date_param, table_name, hash_field, map_to)
      end
    end

    def filter_date(params)
      params.values.find { |param| param.is_a?(SearchFilters::DateRange) }
    end
  end

  def execute_query(current_user)
    ActiveRecord::Base.connection.execute(self.class.sql(current_user, params))
  end
end
