# frozen_string_literal: true

# rubocop:disable Style/ClassAndModuleChildren
module Reports
  # Class for Utils Class
  class Utils
    # rubocop:enable Style/ClassAndModuleChildren
    class << self
      def group_values(values, group_pivot_index)
        return values if group_pivot_index.blank?

        result = {}
        # for every bucket, merge the contents
        group_buckets(values, group_pivot_index).each do |group, bucket|
          # Total the pivot counts for each merge bucket
          merge_buckets(bucket, group_pivot_index).each do |merge, merge_bucket|
            # Add the new row to the result
            merged_pivot = group + merge
            result[merged_pivot] = count_bucket(merge_bucket)
          end
        end
        result
      end

      def date_range(date_string, type)
        type = type.present? ? type : 'date'
        range_clazz = Kernel.const_get("Reports::#{type.capitalize}Range")
        range_clazz.new(date_string)
      end

      def correct_aggregate_counts(values)
        retrun values if values.blank?

        number_of_pivots = values.first.first.size
        return values unless number_of_pivots > 1

        (number_of_pivots - 1).downto(0).each { |i| group_values_by_pivots(values, number_of_pivots, i) }
        values
      end

      private

      def group_buckets(values, group_pivot_index)
        values&.group_by do |pivot, _|
          group_value = yield(pivot[group_pivot_index])
          group_value ||= ''
          group_pivot_index.positive? ? pivot[0..(group_pivot_index - 1)] + [group_value] : [group_value]
        end
      end

      def merge_buckets(bucket, group_pivot_index)
        bucket.group_by do |pivots|
          group_pivot_index < pivots[0].size - 1 ? pivots[0][(group_pivot_index + 1)..-1] : []
        end
      end

      def count_bucket(merge_bucket)
        merge_bucket.reduce(0) { |sum, b| sum + (b[1] || 0) }
      end

      def group_values_by_pivots(values, number_of_pivots, index)
        values.group_by { |pivots, _value| pivots[0..index] }.each do |pivot_group, values_in_group|
          pivots = pivot_group + [''] * (number_of_pivots - pivot_group.size)
          values[pivots] = sum_values_in_group(values_in_group)
        end
      end

      def sum_values_in_group(values_in_group)
        values_in_group.reduce(0) do |sum, pivot_value|
          pivot_value[0].last.present? ? sum + pivot_value[1] : sum
        end
      end
    end
  end
end
