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

def update_records(model_class, record_hashes, _batch)
  model_class.transaction do
    InsertAllService.insert_all(model_class, record_hashes, 'id')
  end
end

def generate_searchable_identifiers(record)
  record.generate_searchable_identifiers.map do |searchable_identifier|
    searchable_identifier.merge(record_type: record.class.name, record_id: record.id)
  end
end

models.map(&:constantize).each do |model|
  records_to_process(model, file_path).find_in_batches(batch_size: 1000).with_index do |records, batch|
    print_log("Process #{model.name} batch #{batch}...")
    searchable_identifiers_to_generate = []
    records.each do |record|
      current_size = record.searchable_identifiers.size
      searchable_identifiers = generate_searchable_identifiers(record)
      generated_size = searchable_identifiers.size
      total = generated_size - current_size
      record_info = "record_type: #{model.name}, record_id: #{record.id}"
      field_names = searchable_identifiers.map { |searchable_identifier| searchable_identifier[:field_name] }
      identifiers_info = "Searchable Identifiers[#{field_names.join(', ')}]"
      if total.positive?
        searchable_identifiers_to_generate += searchable_identifiers
        print_log("#{total} -  #{identifiers_info} will be generated for #{record_info}")
      else
        print_log("No Searchable Identifiers will be generated for #{record_info}")
      end
    end

    if save_records && searchable_identifiers_to_generate.size.positive?
      update_records(SearchableIdentifier, searchable_identifiers_to_generate, batch)
    end

    print_log("#{model.name} batch #{batch} completed.")
  rescue StandardError => e
    print_log("Error #{e.message} when processing the records for batch #{batch}")
  end
end
