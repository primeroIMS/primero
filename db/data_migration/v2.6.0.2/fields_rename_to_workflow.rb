# frozen_string_literal: true

# Renames workflow_status fields to workflow

def print_log(message)
  message = "#{DateTime.now.strftime('%m/%d/%Y %H:%M')}|| #{message}"
  puts message
end

workflow_status_fields = Field.where(name: 'workflow_status')

save_records = ARGV[0] == 'true'

if save_records
  total_updated = workflow_status_fields.update_all(name: 'workflow')
  print_log("#{total_updated} field(s) updated.")
else
  print_log("#{workflow_status_fields.size} field(s) will be updated.")
end
