# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Example of usage:
# rails r generate_unused_fields_report.rb true

def print_log(message)
  message = "[#{DateTime.now.strftime('%m/%d/%Y %H:%M:%S')}]: #{message}"
  puts message
end

force = ARGV[0] == 'true'

if force || !SystemSettings.current.unused_fields_report_file&.attached?
  GenerateUnusedFieldsReport.perform_now
elsif SystemSettings.current.unused_fields_report_file&.attached?
  print_log('Unused Fields Report already exists, run with true to force the execution')
end
