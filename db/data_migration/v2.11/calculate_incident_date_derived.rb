# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Example of usage:
# rails r bin/calculate_incident_date_derived.rb true file/path.txt

def print_log(message)
  message = "[#{DateTime.now.strftime('%m/%d/%Y %H:%M:%S')}]: #{message}"
  puts message
end

save_records = ARGV[0] == 'true'
file_path = ARGV[1]

def print_record_data(model_class, records, batch)
  print_log("===The following changes will be applied for #{model_class.name} records in batch ##{batch}===")
  records.each do |record|
    print_log("id= #{record.id}")
    print_log("data= #{record.changes_to_save_for_record}")
  end
end

def records_to_process(model_class, ids_file_path)
  return model_class unless ids_file_path.present?

  print_log("Loading record ids from #{ids_file_path}...")
  ids_to_update = File.read(ids_file_path).split
  model_class.where(id: ids_to_update)
end

def update_records(model_class, record_hashes, batch)
  model_class.transaction do
    InsertAllService.insert_all(model_class, record_hashes, 'id')
    print_log("Incident batch #{batch} completed.")
  rescue StandardError => e
    print_log("Error #{e.message} when updating the records for batch #{batch}")
  end
end

records_to_process(Incident, file_path).find_in_batches(batch_size: 1000).with_index do |records, batch|
  print_log("Process Incident batch #{batch}...")
  record_hashes = records.map do |record|
    {
      'id' => record.id,
      'data' => record.data.merge('incident_date_derived' => record.calculate_incident_date_derived)
    }
  end

  if save_records
    update_records(Incident, record_hashes, batch)
  else
    print_record_data(Incident, records, batch)
  end
end
