# frozen_string_literal: true

# rubocop:disable Style/ClassAndModuleChildren
module Reports
  # Class for Utils Class
  class Utils
    # rubocop:enable Style/ClassAndModuleChildren
    class << self
      def group_values(values, group_pivot_index, &block)
        return values if group_pivot_index.blank?

        result = {}
        group_buckets = group_buckets(values, group_pivot_index, &block)
        # for every bucket, merge the contents
        group_buckets.each do |group, bucket|
          result.merge!(process_bucket_group(group, bucket, group_pivot_index))
        end
        result
      end

      def group_buckets(values, group_pivot_index)
        values&.group_by do |pivot, _|
          group_value = yield(pivot[group_pivot_index])
          group_value ||= ''
          if group_pivot_index.positive?
            pivot[0..(group_pivot_index - 1)] + [group_value]
          else
            [group_value]
          end
        end
      end

      def process_bucket_group(group, bucket, group_pivot_index)
        merge_buckets = merge_buckets(bucket, group_pivot_index)
        # Total the pivot counts for each merge bucket
        result = {}
        merge_buckets.each do |merge, merge_bucket|
          count = merge_bucket.reduce(0) do |sum, b|
            sum + (b[1] || 0)
          end
          # Add the new row to the result
          merged_pivot = group + merge
          result[merged_pivot] = count
        end
        result
      end

      def merge_buckets(bucket, group_pivot_index)
        bucket.group_by do |pivots|
          if group_pivot_index < pivots[0].size - 1
            pivots[0][(group_pivot_index + 1)..-1]
          else
            []
          end
        end
      end

      def date_range(date_string, type)
        type = type.present? ? type : 'date'
        range_clazz = Kernel.const_get("Reports::#{type.capitalize}Range")
        range_clazz.new(date_string)
      end

      def correct_aggregate_counts(values)
        return values if values.blank?

        number_of_pivots = values.first.first.size
        return values unless number_of_pivots > 1

        calculate_pivots(values, number_of_pivots)
      end

      def calculate_pivots(values, number_of_pivots)
        (number_of_pivots - 1).downto(0).each do |i|
          values.group_by { |pivots, _value| pivots[0..i] }.each do |pivot_group, values_in_group|
            pivots = pivot_group + [''] * (number_of_pivots - pivot_group.size)
            values[pivots] = sum_pivot_values(values_in_group)
          end
        end
        values
      end

      def sum_pivot_values(values_in_group)
        values_in_group.reduce(0) do |sum, pivot_value|
          pivot_value[0].last.present? ? sum + pivot_value[1] : sum
        end
      end
    end
  end
end
