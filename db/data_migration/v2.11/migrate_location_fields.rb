# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Example of usage:
# rails r bin/migrate_location_filters.rb true

def print_log(message)
  message = "[#{DateTime.now.strftime('%m/%d/%Y %H:%M')}]: #{message}"
  puts message
end

def deprecated_location_name?(field_name)
  return false unless field_name.present?

  field_name.match?(/[a-z]+[0-5]{1}$/) && !field_name.starts_with?('loc:')
end

def rename_field_names(field_names)
  field_names.map do |field_name|
    next(field_name) unless deprecated_location_name?(field_name)

    "loc:#{field_name}"
  end
end

save_records = ARGV[0] == 'true'

reports = Report.joins('CROSS JOIN UNNEST(filters) AS report_filters')
                .joins('CROSS JOIN UNNEST(disaggregate_by) AS report_dissagregate_by')
                .joins('CROSS JOIN UNNEST(aggregate_by) AS report_aggregate_by')
reports = reports.distinct.where(
  %(
    report_filters->>'attribute' ~ '[a-z]+[0-5]{1}$'
    OR report_dissagregate_by ~ '[a-z]+[0-5]{1}$'
    OR report_aggregate_by ~ '[a-z]+[0-5]{1}$'
  )
)

reports.each do |report|
  report.disaggregate_by = rename_field_names(report.disaggregate_by)
  report.aggregate_by = rename_field_names(report.aggregate_by)
  report.filters = report.filters.map do |filter|
    next(filter) unless deprecated_location_name?(filter['attribute'])

    filter['attribute'] = "loc:#{filter['attribute']}"
  end

  next unless report.changed?

  if save_records
    report.save!
    print_log("Report id: #{report.id} updated successfully.")
  else
    print_log("Report Id: #{report.id}")
    print_log('Changes:')
    report.changes.each { |change| print_log(change) }
  end
rescue StandardError => e
  print_log("Error #{e.message} when updating the report id: #{report.id}")
end
