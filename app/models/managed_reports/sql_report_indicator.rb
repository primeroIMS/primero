# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Class to hold SQL results
# rubocop:disable Metrics/ClassLength
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

      if results_array.any? { |result| result.key?('group_id') }
        build_groups(results_array, params)
      elsif results_array.any? { |result| result.key?('data') }
        build_data_values_from_json(results_array)
      elsif results_array.any? { |result| result.key?('key') }
        build_data_values_from_keys(results_array)
      else
        results_array
      end
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
      when WEEK then range_by_week(date_range)
      else date_range.map(&:year).uniq
      end
    end

    def range_by_week(date_range)
      date_range.map do |date|
        "#{date.beginning_of_week.strftime('%Y-%m-%d')} - #{date.end_of_week.strftime('%Y-%m-%d')}"
      end.uniq
    end

    def build_groups(results, params = {})
      build_ranges(params).map do |current_range|
        values_range = results.select { |result| result['group_id'] == current_range }

        { group_id: current_range, data: build_data_values(values_range) }
      end
    end

    def build_data_values(values)
      return build_data_values_from_json(values) if values.any? { |value| value.key?('data') }
      return build_data_values_from_keys(values) if values.any? { |value| value.key?('key') }

      values.each_with_object([]) do |curr, acc|
        curr.delete('group_id')

        acc << curr
      end
    end

    def build_data_values_from_keys(values)
      values.each_with_object([]) do |curr, acc|
        current_group = acc.find { |group| group[:id] == curr['name'] }
        next current_group[curr['key'].to_sym] = curr['sum'] if current_group.present?

        acc << value_to_data_element(curr)
      end
    end

    def value_to_data_element(value)
      element = { id: value['name'], value['key'].to_sym => value['sum'] }
      return element unless value.key?('total')

      element.merge(total: value['total'])
    end

    def build_data_values_from_json(values)
      values.map { |value| JSON.parse(value['data']).merge({ 'id' => value['name'].gsub('"', '') }) }
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

    def build_date_group(params = {}, opts = {}, model_class = nil)
      date_param = filter_date(params)
      return unless date_param.present?

      field_name = date_param.searchable_field_name if date_param.searchable_field_name?(model_class)
      table_name = opts[:table_name] || model_class.table_name
      grouped_date_query(
        params['grouped_by'], date_param, table_name, opts[:hash_field], field_name || date_param.field_name
      )
    end

    def grouped_date_query(grouped_by_param, date_param, table_name = nil, hash_field = 'data', map_to = nil)
      return unless grouped_by_param.present? && date_param.present?

      case grouped_by_param.value
      when QUARTER then grouped_quarter_query(date_param, table_name, hash_field, map_to)
      when MONTH then grouped_month_query(date_param, table_name, hash_field, map_to)
      when WEEK then grouped_by_week_query(date_param, table_name, hash_field, map_to)
      else grouped_year_query(date_param, table_name, hash_field, map_to)
      end
    end

    def filter_date(params)
      params.values.find { |param| param.is_a?(SearchFilters::DateRange) }
    end

    # rubocop:disable Metrics/MethodLength
    def grouped_by_week_query(date_param, table_name, hash_field = 'data', map_to = nil)
      return unless date_param.present?

      field_name = map_to || date_param.field_name
      quoted_field = grouped_date_field(field_name, table_name, hash_field)

      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          %(
            to_char(date_trunc('week', #{quoted_field} + interval '1 days') - '1 days'::interval, 'yyyy-mm-dd')
            || ' - ' ||
            to_char(date_trunc('week', #{quoted_field} + interval '1 days') + '5 days'::interval, 'yyyy-mm-dd')
          ),
          grouped_date_params(field_name, hash_field)
        ]
      )
    end
    # rubocop:enable Metrics/MethodLength

    def group_id_alias(params_grouped_by)
      return unless params_grouped_by.present?

      'group_id'
    end

    def table_name_for_query(params)
      return 'violations' if params['ctfmr_verified_date'].present? ||
                             params&.[]('ghn_date_filter')&.field_name == 'ctfmr_verified_date'

      'incidents'
    end
  end

  def execute_query(current_user)
    ActiveRecord::Base.connection.execute(self.class.sql(current_user, params))
  end
end
# rubocop:enable Metrics/ClassLength
