# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Example of usage:
# rails r bin/migrate_location_filters.rb true

def print_log(message)
  message = "[#{DateTime.now.strftime('%m/%d/%Y %H:%M')}]: #{message}"
  puts message
end

def deprecated_field_name?(field_name, matchers)
  return false if field_name.starts_with?('loc:')

  matchers.any? { |matcher| matcher.match?(field_name) }
end

def rename_field_names(field_names, matchers)
  field_names.map do |field_name|
    next(field_name) unless deprecated_field_name?(field_name, matchers)

    "loc:#{field_name}"
  end
end

save_records = ARGV[0] == 'true'

location_field_names = Field.where(
  type: Field::SELECT_BOX,
  option_strings_source: %w[Location ReportingLocation]
).pluck(:name)

matchers = location_field_names.map { |field_name| Regexp.new("#{field_name}([0-5]{1})?$") }

Report.all.each do |report|
  report.disaggregate_by = rename_field_names(report.disaggregate_by, matchers)
  report.aggregate_by = rename_field_names(report.aggregate_by, matchers)
  report.filters = report.filters.map do |filter|
    next(filter) unless deprecated_field_name?(filter['attribute'], matchers)

    filter.merge('attribute' => "loc:#{filter['attribute']}")
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
