# frozen_string_literal: true

# Script to migrate Reports

log_filename = "output-workflow-status-#{DateTime.now.strftime('%Y%m%d.%H%M')}.log"

LOG = Logger.new(log_filename)
LOG.formatter = proc do |_severity, _datetime, _progname, msg|
  "#{msg}\n"
end

def print_log(message)
  message = "#{DateTime.now.strftime('%m/%d/%Y %H:%M')}|| #{message}"
  puts message
  LOG.info message
end

save_records = ARGV[0] || false

OLD_FIELD = 'workflow_status'
NEW_FIELD = 'workflow'

initial_message = "Starting update of #{OLD_FIELD} fields in reports..."

print_log(initial_message)

workflow_reports = Report.joins(
  %(
    left join (
      select
        id,
        unnest(filters) as filter_list
      from reports
    ) as report_filters
    on report_filters.id = reports.id
    and report_filters.filter_list ->>'attribute' = '#{OLD_FIELD}'
  )
)
workflow_reports = workflow_reports.where(
  '? = any(aggregate_by)', OLD_FIELD
).or(
  workflow_reports.where(
    '? = any(disaggregate_by)', OLD_FIELD
  )
).or(
  workflow_reports.where(
    "report_filters.filter_list->>'attribute' = ?", OLD_FIELD
  )
)
workflow_reports.find_in_batches(batch_size: 100) do |reports|
  reports.each do |report|
    report.aggregate_by = report.aggregate_by.map do |elem|
      elem == OLD_FIELD ? NEW_FIELD : elem
    end

    report.disaggregate_by = report.disaggregate_by.map do |elem|
      elem == OLD_FIELD ? NEW_FIELD : elem
    end

    report.filters = report.filters.map do |filter|
      next(filter) unless filter['attribute'] == OLD_FIELD

      filter.merge('attribute' => NEW_FIELD)
    end

    changes = report.changes.keys

    if save_records == 'true'
      report.save!
      print_log("Report ID: #{report.id} updated due to: #{changes}")
    else
      print_log("Report ID: #{report.id} will be updated due to: #{changes}")
    end
  end
end

print_log('Done.')
