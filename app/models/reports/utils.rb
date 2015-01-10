module Reports

  class Utils

    def self.group_values(values, group_pivot_index)
      result = values
      if group_pivot_index.present?
        result = {}
        group_buckets = values.group_by do |pivot, _|
          group_value = yield(pivot[group_pivot_index])
          group_value ||= ''
          if group_pivot_index > 0
            pivot[0..(group_pivot_index-1)] + [group_value]
          else
            [group_value]
          end
        end
        #for every bucket, merge the contents
        group_buckets.each do |group, bucket|
          merge_buckets = bucket.group_by do |pivots|
            if group_pivot_index < pivots[0].size - 1
              pivots[0][(group_pivot_index+1)..-1]
            else
              []
            end
          end
          #Total the pivot counts for each merge bucket
          merge_buckets.each do |merge, merge_bucket|
            count = merge_bucket.reduce(0) do |sum, b|
              sum + (b[1] ? b[1] : 0)
            end
            #Add the new row to the result
            merged_pivot = group + merge
            result[merged_pivot] = count
          end
        end
      end
      return result
    end

  end

end