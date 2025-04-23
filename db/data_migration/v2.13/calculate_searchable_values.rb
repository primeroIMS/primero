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
  model_class.transaction do
    InsertAllService.insert_all(model_class, record_hashes, :id)
  end
end

def generate_searchable_hashes(record, fields, data_to_update)
  fields.reduce([]) do |memo, field_name|
    value = record.data[field_name]
    next(memo) if value.nil?

    memo + record.generate_searchable_hashes(data_to_update, field_name, value).map do |elem|
      elem.merge(record_id: record.id, record_type: record.class.name)
    end
  end
end

def update_searchable_records(searchables_to_update, save_records, batch)
  return unless searchables_to_update.size.positive?

  searchables_to_update.each do |searchable_type, searchable_hashes|
    hashes_to_update = searchable_hashes.map { |searchable| searchable.except(:_destroy) }
    print_log("#{searchable_hashes.size} #{searchable_type} will be updated for batch #{batch}")
    update_records(searchable_type.classify.constantize, hashes_to_update) if save_records
  end
end

def create_searchable_records(searchables_to_create, save_records, batch)
  return unless searchables_to_create.size.positive?

  searchables_to_create.each do |searchable_type, searchable_hashes|
    print_log("#{searchable_hashes.size} #{searchable_type} will be created for batch #{batch}")
    update_records(searchable_type.classify.constantize, searchable_hashes) if save_records
  end
end

def destroy_searchable_records(searchables_to_destroy, save_records, batch)
  return unless searchables_to_destroy.size.positive?

  searchables_to_destroy.each do |searchable_type, searchable_hashes|
    ids_to_delete = searchable_hashes.map { |hash| hash[:id] }
    if ids_to_delete.size.positive?
      print_log("#{searchable_hashes.size} #{searchable_type} will be deleted for batch #{batch}")
      searchable_type.classify.constantize.where(id: ids_to_delete).delete_all if save_records
    else
      print_log("No #{searchable_type} will be deleted in batch #{batch}")
    end
  end
end

models.map(&:constantize).each do |model|
  records_to_process(model, file_path).find_in_batches(batch_size: 1000).with_index do |records, batch|
    print_log("Process #{model.name} batch #{batch}...")
    searchables_to_create = {}
    searchables_to_update = {}
    searchables_to_destroy = {}
    records.each do |record|
      model.normalized_field_names.each do |searchable_type, fields|
        searchables_values_to_update = record.searchable_values_to_update(searchable_type)
        data_to_update = searchables_values_to_update.reject { |elem| elem[:_destroy].present? }
        data_to_destroy = searchables_values_to_update.select { |elem| elem[:_destroy].present? }
        data_to_create = generate_searchable_hashes(record, fields, data_to_update)

        searchables_to_create[searchable_type] = (searchables_to_create[searchable_type] || []) + data_to_create
        searchables_to_update[searchable_type] = (searchables_to_update[searchable_type] || []) + data_to_update
        searchables_to_destroy[searchable_type] = (searchables_to_destroy[searchable_type] || []) + data_to_destroy
      end
    end

    create_searchable_records(searchables_to_create, save_records, batch)
    update_searchable_records(searchables_to_update, save_records, batch)
    destroy_searchable_records(searchables_to_destroy, save_records, batch)
    print_log("#{model.name} batch #{batch} completed.")
  rescue StandardError => e
    print_log("Error #{e.message} when processing the records for batch #{batch}")
  end
end
