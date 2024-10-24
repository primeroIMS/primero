# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Example of usage:
# rails r bin/calculate_solr_fields Child,Incident,TracingRequest true file/path.txt

def print_log(message)
  message = "[#{DateTime.now.strftime('%m/%d/%Y %H:%M')}]: #{message}"
  puts message
end

models = (ARGV[0] || '').split(',')
save_records = ARGV[1] == 'true'
file_path = ARGV[2]

return unless models.present?

def print_record_data(model_class, records, batch)
  print_log("===The following changes will be applied for #{model_class.name} records in batch ##{batch}===")
  records.each do |record|
    print_log("id= #{record.id}")
    print_log("data= #{record.changes_to_save_for_record}")
    print_log("phonetic_tokens= #{record.generate_tokens}")
  end
end

def update_records(model_class, record_hashes, batch)
  model_class.transaction do
    InsertAllService.insert_all(model_class, record_hashes, 'id')
    print_log('===Done===')
  rescue StandardError => e
    print_log("Error #{e.message} when updating the records for batch #{batch}")
  end
end

def process_records(model_class, record_hashes, batch)
  print_log("#{model_class.name} ids for batch ##{batch}:")
  print_log(record_hashes.map { |data| data['id'] })
  update_records(model_class, record_hashes, batch)
end

def records_to_process(model_class, ids_file_path)
  model_class_and_relations = model_class.eager_loaded_class
  model_class_and_relations = model_class_and_relations.includes(:transitions) if model_class.name == 'Child'
  model_class_and_relations = model_class_and_relations.includes(:incidents) if model_class.name == 'Child'

  return model_class_and_relations unless ids_file_path.present?

  print_log("Loading record ids from #{ids_file_path}...")
  ids_to_update = File.read(ids_file_path).split
  model_class_and_relations.where(id: ids_to_update)
end

# rubocop:disable Metrics/BlockLength
if models.include?('Child')
  print_log('Recalculating solr fields for Child...')
  records_to_process(Child, file_path).find_in_batches(batch_size: 1000).with_index do |records, batch|
    record_hashes = records.map do |record|
      {
        'id' => record.id,
        'data' => record.data.merge(
          'has_photo' => record.calculate_has_photo,
          'has_incidents' => record.calculate_has_incidents,
          'flagged' => record.calculate_flagged,
          'current_alert_types' => record.calculate_current_alert_types,
          'not_edited_by_owner' => record.calculate_not_edited_by_owner,
          'transferred_to_users' => record.calculate_transferred_to_users,
          'transferred_to_user_groups' => record.calculate_transferred_to_user_groups,
          'referred_users' => record.calculate_referred_users,
          'referred_users_present' => record.calculate_referred_users_present,
          'family_number' => record.family_number,
          'assessment_due_dates' => record.calculate_assessment_due_dates,
          'case_plan_due_dates' => record.calculate_case_plan_due_dates,
          'followup_due_dates' => record.calculate_followup_due_dates,
          'service_due_dates' => record.calculate_service_due_dates,
          'followup_dates' => record.calculate_followup_dates,
          'reunification_dates' => record.calculate_reunification_dates,
          'tracing_dates' => record.calculate_tracing_dates,
          'service_implemented_day_times' => record.calculate_service_implemented_day_times
        ),
        'phonetic_data' => { 'tokens' => record.generate_tokens }
      }
    end

    if save_records
      process_records(Child, record_hashes, batch)
    else
      print_record_data(Child, records, batch)
    end
  end
end
# rubocop:enable Metrics/BlockLength

if models.include?('Incident')
  print_log('Recalculating solr fields for Incident...')
  records_to_process(Incident, file_path).find_in_batches(batch_size: 1000).with_index do |records, batch|
    record_hashes = records.map do |record|
      record.recalculate_association_fields
      {
        'id' => record.id,
        'data' => record.data,
        'phonetic_data' => { 'tokens' => record.generate_tokens }
      }
    end

    if save_records
      process_records(Incident, record_hashes, batch)
    else
      print_record_data(Incident, records, batch)
    end
  end
end

if models.include?('TracingRequest')
  print_log('Recalculating solr fields for TracingRequest...')

  records_to_process(TracingRequest, file_path).find_in_batches(batch_size: 1000).with_index do |records, batch|
    record_hashes = records.map do |record|
      {
        'id' => record.id,
        'data' => record.data.merge(
          'tracing_names' => record.calculate_tracing_names(record.traces),
          'tracing_nicknames' => record.calculate_tracing_nicknames(record.traces)
        ),
        'phonetic_data' => { 'tokens' => record.generate_tokens }
      }
    end

    if save_records
      process_records(TracingRequest, record_hashes, batch)
    else
      print_record_data(TracingRequest, records, batch)
    end
  end
end

if models.include?('Family')
  print_log('Recalculating solr fields for Family...')

  records_to_process(Family, file_path).find_in_batches(batch_size: 1000).with_index do |records, batch|
    record_hashes = records.map do |record|
      { 'id' => record.id, 'phonetic_data' => { 'tokens' => record.generate_tokens } }
    end

    if save_records
      process_records(Family, record_hashes, batch)
    else
      print_record_data(Family, records, batch)
    end
  end
end

if models.include?('RegistryRecord')
  print_log('Recalculating solr fields for RegistryRecord...')

  records_to_process(RegistryRecord, file_path).find_in_batches(batch_size: 1000).with_index do |records, batch|
    record_hashes = records.map do |record|
      { 'id' => record.id, 'phonetic_data' => { 'tokens' => record.generate_tokens } }
    end

    if save_records
      process_records(RegistryRecord, record_hashes, batch)
    else
      print_record_data(RegistryRecord, records, batch)
    end
  end
end