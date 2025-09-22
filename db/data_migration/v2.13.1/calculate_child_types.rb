# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# Example of usage:
# rails r bin/calculate_child_types.rb true file/path.txt

def print_log(message)
  message = "[#{DateTime.now.strftime('%m/%d/%Y %H:%M:%S')}]: #{message}"
  puts message
end

save_records = ARGV[0] == 'true'
file_path = ARGV[1]

def records_to_process(model_class, ids_file_path)
  return model_class unless ids_file_path.present?

  print_log("Loading record ids from #{ids_file_path}...")
  ids_to_update = File.read(ids_file_path).split
  model_class.where(id: ids_to_update)
end

records_to_process(Incident, file_path).find_in_batches(batch_size: 1000).with_index do |records, batch|
  print_log("Process batch #{batch}...")

  record_hashes = records.map do |record|
    { id: record.id, data: record.data.merge(child_types: record.recalculate_child_types) }
  end

  Incident.transaction { InsertAllService.insert_all(Incident, record_hashes, :id) } if save_records

  print_log("Batch #{batch} completed.")
rescue StandardError => e
  print_log("Error #{e.message} when processing the records for batch #{batch}")
end
