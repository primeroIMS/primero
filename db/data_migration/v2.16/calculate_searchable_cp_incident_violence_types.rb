# frozen_string_literal: true

# Example of usage:
# rails r ./db/data_migration/v2.16/calculate_searchable_cp_incident_violence_type.rb true

def print_log(message)
  message = "[#{DateTime.now.strftime('%m/%d/%Y %H:%M:%S')}]: #{message}"
  puts message
end

save_records = ARGV[0] == 'true'

cp_incidents = Incident.where(srch_module_id: PrimeroModule::CP)
print_log("Found #{cp_incidents.count} CP incidents.")

cp_incidents.in_batches(of: 1000).each_with_index do |batch, index|
  print_log("Process Incident batch #{index}...")
  batch.update_all("srch_cp_incident_violence_type = data->>'cp_incident_violence_type'") if save_records
  print_log("Incident batch #{index} completed.")
rescue StandardError => e
  print_log("Error #{e.message} when processing the records for batch #{index}")
end
