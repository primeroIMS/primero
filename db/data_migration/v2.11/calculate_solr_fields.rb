# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Example of usage:
# rails r bin/calculate_solr_fields Child,Incident,TracingRequest true

def print_log(message)
  message = "#{DateTime.now.strftime('%m/%d/%Y %H:%M')}|| #{message}"
  puts message
end

models = (ARGV[0] || '').split(',')
save_records = ARGV[1] == 'true'

return unless models.present?

if models.include?('Child')
  print_log('Recalculating solr fields for Child...')
  Child.find_in_batches(batch_size: 1000) do |records|
    record_data = records.map do |record|
      {
        'id' => record.id,
        'data' => record.data.merge(
          'has_photo' => record.calculate_has_photo,
          'has_incidents' => record.calculate_has_incidents,
          'flagged' => record.calculate_flagged,
          'current_alert_types' => record.calculate_current_alert_types
        ),
        'phonetic_data' => { 'tokens' => record.generate_tokens }
      }
    end
    if save_records
      Child.transaction do
        InsertAllService.insert_all(Child, record_data, 'id')
        print_log('Child records updated.')
      end
    else
      records.each do |record|
        print_log("Child with id #{record.id} will be updated")
        print_log("data: #{record.changes_to_save_for_record}")
        print_log("phonetic_tokens: #{record.generate_tokens}")
      end
    end
  end
end

if models.include?('Incident')
  print_log('Recalculating solr fields for Incident...')
  Incident.find_in_batches(batch_size: 1000) do |records|
    record_data = records.map do |record|
      record.recalculate_association_fields
      {
        'id' => record.id,
        'data' => record.data,
        'phonetic_data' => { 'tokens' => record.generate_tokens }
      }
    end
    Incident.transaction do
      if save_records
        InsertAllService.insert_all(Incident, record_data, 'id')
        print_log('Incident records updated.')
      else
        records.each do |record|
          print_log("Incident with id #{record.id} will be updated")
          print_log("data: #{record.changes_to_save_for_record}")
          print_log("phonetic_tokens: #{record.generate_tokens}")
        end
      end
    end
  end
end

if models.include?('TracingRequest')
  print_log('Recalculating solr fields for TracingRequest...')

  TracingRequest.find_in_batches(batch_size: 1000) do |records|
    record_data = records.map do |record|
      { 'id' => record.id, 'phonetic_data' => { 'tokens' => record.generate_tokens } }
    end
    TracingRequest.transaction do
      if save_records
        InsertAllService.insert_all(TracingRequest, record_data, 'id')
        print_log('TracingRequest records updated.')
      else
        records.each do |record|
          print_log("TracingRequest with id #{record.id} will be updated")
          print_log("data: #{record.changes_to_save_for_record}")
          print_log("phonetic_tokens: #{record.generate_tokens}")
        end
      end
    end
  end
end
