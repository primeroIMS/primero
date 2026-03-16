# frozen_string_literal: true

# Copyright (c) 2014 - 2026 UNICEF. All rights reserved.

# Example of usage:
# rails r bin/calculate_transitionable_values Child,Incident,TracingRequest true file/path.txt

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
  model_class.transaction { InsertAllService.insert_all(model_class, record_hashes, 'id') }
end

models.map(&:constantize).each do |model|
  records_to_process(model, file_path).find_in_batches(batch_size: 1000).with_index do |records, batch|
    print_log("Process #{model.name} batch #{batch}...")

    record_hashes = records.map do |record|
      {
        'id' => record.id,
        'data' => record.data.merge(
          'referred_users_pending' => record.calculate_referred_users_pending,
          'referred_users_pending_present' => record.calculate_referred_users_pending_present,
          'referred_users_accepted' => record.calculate_referred_users_accepted,
          'referred_users_accepted_present' => record.calculate_referred_users_accepted_present,
          'last_referral_rejected_at' => record.calculate_last_referral_rejected_at,
          'last_referral_done_at' => record.calculate_last_referral_done_at
        )
      }
    end

    update_records(model, record_hashes) if save_records
    print_log("#{model.name} batch #{batch} completed.")
  rescue StandardError => e
    print_log("Error #{e.message} when processing the records for batch #{batch}")
  end
end
