# frozen_string_literal: true

# Example of usage:
# rails r ./db/data_migration/v2.16.1/recalculate_case_incident_types.rb 2026-10-27 true

def print_log(message)
  message = "[#{DateTime.now.strftime('%m/%d/%Y %H:%M:%S')}]: #{message}"
  puts message
end

from = ARGV[0].present? ? Time.zone.parse(ARGV[0])&.beginning_of_day : nil
save_records = ARGV[1] == 'true'
to = Time.zone.now

if from.blank?
  print_log('A valid from date is required')
  return
end

last_updated_filter = SearchFilters::DateRange.new(field_name: 'last_updated_at', from:, to:)

case_ids = Incident.where.not(srch_module_id: PrimeroModule::MRM).where.not(incident_case_id: nil).where(
  last_updated_filter.query(Incident)
).distinct.pluck(:incident_case_id)

print_log("Found #{case_ids.size} cases with incidents updated between #{from.iso8601} and #{to.iso8601}.")

Child.includes(:incidents).where(id: case_ids).find_in_batches(batch_size: 1000).with_index do |batch, index|
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
