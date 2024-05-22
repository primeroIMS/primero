# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

def print_log(message)
  message = "#{DateTime.now.strftime('%m/%d/%Y %H:%M')}|| #{message}"
  puts message
end

print_log('Starting update of report filters...')

save_records = ARGV[0] || false

reports = Report.joins(
  %(
    left join (
      select
        id,
        unnest(filters) as filter_list
      from reports
    ) as report_filters
    on report_filters.id = reports.id
  )
).where("report_filters.filter_list->'value' @> cast('[\"not_null\"]' as jsonb)")

reports.each do |report|
  if save_records == 'true'
    report.filters = report.filters.map do |filter|
      next(filter) unless filter['value'] == %w[not_null]

      filter.merge('value' => '', 'constraint' => 'not_null')
    end
    report.save!
    print_log("Report ID: #{report.id} updated.")
  else
    print_log("Report ID: #{report.id} will be updated, current filters=#{report.filters}")
  end
end
