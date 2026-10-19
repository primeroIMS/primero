# frozen_string_literal: true

# Example of usage:
# rails r ./db/data_migration/v2.16/calculate_case_incident_types.rb true

def print_log(message)
  message = "[#{DateTime.now.strftime('%m/%d/%Y %H:%M:%S')}]: #{message}"
  puts message
end

save_records = ARGV[0] == 'true'

incident_count = Incident.where.not(srch_module_id: PrimeroModule::MRM).count
print_log('No incidents found. Migration unnecessary') && return unless incident_count.positive?

cases_with_incidents = Child.includes(:incidents).joins(:incidents).distinct
print_log("Found #{cases_with_incidents.count} cases with incidents.")

cases_with_incidents.in_batches(of: 1000).each_with_index do |batch, index|
  print_log("Process Case batch #{index}...")

  case_hashes = batch.map do |case_|
    incident_types = case_.incidents.map(&:incident_type).compact.uniq
    {
      id: case_.id,
      srch_incident_types: incident_types,
      data: case_.data.merge(incident_types:)
    }
  end
  InsertAllService.insert_all(Child, case_hashes, :id) if save_records
  print_log("Case batch #{index} completed.")
rescue StandardError => e
  print_log("Error #{e.message} when processing the records for batch #{index}")
end
