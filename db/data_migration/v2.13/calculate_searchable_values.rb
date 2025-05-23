# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Example of usage:
# rails r bin/calculate_searchable_values Child,Incident,TracingRequest true file/path.txt

def print_log(message)
  message = "[#{DateTime.now.strftime('%m/%d/%Y %H:%M:%S')}]: #{message}"
  puts message
end

models = (ARGV[0] || '').split(',')
save_records = ARGV[1] == 'true'
file_path = ARGV[2]

return unless models.present?

def records_to_process(model_class, ids_file_path)
  return model_class unless ids_file_path.present?

  print_log("Loading record ids from #{ids_file_path}...")
  ids_to_update = File.read(ids_file_path).split
  model_class.where(id: ids_to_update)
end

def update_records(model_class, record_hashes)
  model_class.transaction { InsertAllService.insert_all(model_class, record_hashes, :id) }
end

models.map(&:constantize).each do |model|
  records_to_process(model, file_path).find_in_batches(batch_size: 1000).with_index do |records, batch|
    print_log("Process #{model.name} batch #{batch}...")

    searchable_hashes = records.map do |record|
      model.searchable_field_names.each_with_object({}) do |field_name, memo|
        searchable_column = model.searchable_column_name(field_name)
        memo[searchable_column] = record.data[field_name]
        memo[:id] = record.id
      end
    end

    update_records(model, searchable_hashes) if save_records
    print_log("#{model.name} batch #{batch} completed.")
  rescue StandardError => e
    print_log("Error #{e.message} when processing the records for batch #{batch}")
  end
end
