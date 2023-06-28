#! /usr/bin/env ruby

require_relative('../lib/primero_database.rb')

# Close the db connection

def check_not_seeded
  return true if ENV['PRIMERO_CONFIGURATION_RUN_SCRIPTS'] == 'true'

  !PrimeroDatabase.instance.seeded?
end

def check_configuration_file_version
  expected_version = ENV['PRIMERO_CONFIGURATION_FILE_VERSION']
  return true unless expected_version.is_a?(String) && expected_version.length.positive?

  current_version = PrimeroDatabase.instance.configuration_file_version
  current_version.nil? || current_version != expected_version
end

def not_loading_already_seeded
  puts('Not loading: PRIMERO_CONFIGURATION_RUN_SCRIPTS != true; Primero is already seeded')
end

def not_loading_pinned_version
  puts("Not loading: Primero configuration is pinned to #{ENV['PRIMERO_CONFIGURATION_FILE_VERSION']}")
end

def usage
  puts 'Usage: load_configuration <path/to/configuration/script.rb'
end

return usage unless ARGV.length.positive? && File.exist?(ARGV[0])
return not_loading_already_seeded unless check_not_seeded
return not_loading_pinned_version unless check_configuration_file_version

require_relative '../config/environment'
require ARGV[0]
SystemSettings.current.update(configuration_file_version: ENV['PRIMERO_CONFIGURATION_FILE_VERSION'])
