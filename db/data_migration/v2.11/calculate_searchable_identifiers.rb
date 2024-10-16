# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Example of usage:
# rails r bin/calculate_solr_fields Child,Incident,TracingRequest true file/path.txt

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

models.map(&:constantize).each do |model|
  records_to_process(model, file_path).find_in_batches(batch_size: 1000).with_index do |records, batch|
    print_log("Process #{model.name} batch #{batch}...")
    records.each do |record|
      current_size = record.searchable_identifiers.size
      record.generate_searchable_identifiers
      generated_size = record.searchable_identifiers.size
      total = generated_size - current_size
      record_info = "record_type: #{model.name}, record_id: #{record.id}"
      field_names = record.searchable_identifiers.map(&:field_name)
      identifiers_info = "Searchable Identifiers[#{field_names.join(', ')}]"
      if save_records
        record.save!
        print_log("#{total} - #{identifiers_info} generated for #{record_info}")
      else
        print_log("#{total} -  #{identifiers_info} will be generated for #{record_info}")
      end
    end
  end
end
