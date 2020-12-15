# frozen_string_literal: true

# Recursively Merge two hashes representing the JSON blob data of the record
class RecordMergeDataHashService
  def self.merge_data(old_data, new_data)
    RecordMergeDataHashService.new.merge_data(old_data, new_data)
  end

  def merge_data(old_data, new_data)
    if old_data.is_a?(Hash) && new_data.is_a?(Hash)
      merge_hashes(old_data, new_data)
    elsif RecordMergeDataHashService.array_of_hashes?(old_data) && RecordMergeDataHashService.array_of_hashes?(new_data)
      merge_array_of_hashes(old_data, new_data).reject { |record| record['_destroy'] }
    else
      new_data
    end
  end

  def merge_hashes(old_data, new_data)
    old_data.merge(new_data) do |_, old_value, new_value|
      merge_data(old_value, new_value)
    end
  end

  def merge_array_of_hashes(old_data, new_data)
    merged_old_data = old_data.each_with_object([]) do |old_nested_record, result|
      nested_record_id = old_nested_record['unique_id']
      (result << old_nested_record) && next unless nested_record_id

      new_nested_record = new_data.find { |r| r['unique_id'] == nested_record_id }
      (result << old_nested_record) && next unless new_nested_record

      result << merge_data(old_nested_record, new_nested_record)
    end
    append = new_data.reject { |new_record| merged_old_data.find { |r| r['unique_id'] == new_record['unique_id'] } }
    merged_old_data + append
  end

  def self.array_of_hashes?(value)
    value.is_a?(Array) && (value.blank? || value.first.is_a?(Hash))
  end
end
