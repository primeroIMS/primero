# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Helper methods for percentange indicators
module ManagedReports::PercentageIndicator
  extend ActiveSupport::Concern

  # ClassMethods
  module ClassMethods
    def fields
      []
    end

    def results_in_percentages(results)
      return in_percentages_by_group(results) if results.any? { |result| result.key?('group_id') }

      in_percentages(results)
    end

    def in_percentages_by_group(results)
      total_by_fields = calculate_total_by_fields(fields, results)
      total_by_group = calculate_total_records_by_group(results)

      results.map do |result|
        total_records_in_group = total_by_group[result['group_id']]
        result_in_percentages(result, total_by_fields, total_records_in_group).merge('group_id' => result['group_id'])
      end
    end

    def in_percentages(results)
      total_by_fields = calculate_total_by_fields(fields, results)
      total_records = calculate_total_records(results)
      results.map { |result| result_in_percentages(result, total_by_fields, total_records) }
    end

    def result_in_percentages(result, total_by_fields, total_records)
      {
        'name' => result[result_map['name']],
        'key' => result[result_map['key']],
        'sum' => calculate_sum(result, total_by_fields),
        'total' => calculate_total(result, total_by_fields, total_records)
      }
    end

    def calculate_sum(result, total_by_fields)
      field_key = result_group_key(result, result_map['key'])
      ((result['count'] * 100) / total_by_fields[field_key]).round(2)
    end

    def calculate_total(result, total_by_fields, total_records)
      field_key = result_group_key(result, result_map['name'])
      ((total_by_fields[field_key] * 100) / total_records).round(2)
    end

    def result_map
      raise NotImplementedError
    end

    def calculate_total_by_fields(fields, results)
      fields.reduce({}) do |memo, field|
        grouped_results = results.group_by { |result| result_group_key(result, field) }
        memo.merge(
          grouped_results.transform_values { |values| BigDecimal(values.sum { |value| value['count'] }) }
        )
      end
    end

    def calculate_total_records(results)
      BigDecimal(results.sum { |result| result['count'] })
    end

    def calculate_total_records_by_group(results)
      results.group_by { |result| result['group_id'] }.transform_values do |values|
        BigDecimal(values.sum { |value| value['count'] })
      end
    end

    def result_group_key(result, field)
      [result['group_id'], result[field]].compact.join('-')
    end
  end
end
