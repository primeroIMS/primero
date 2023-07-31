#! /usr/bin/env ruby

require_relative('../lib/primero_database')

def check_not_seeded
  return true if ENV['PRIMERO_CONFIGURATION_RUN_SCRIPTS'] == 'true'

  !PrimeroDatabase.instance.seeded?
end

def check_configuration_file_version
  expected_version = ENV.fetch('PRIMERO_CONFIGURATION_FILE_VERSION', nil)
  return true unless expected_version.is_a?(String) && expected_version.length.positive?

  current_version = PrimeroDatabase.instance.configuration_file_version
  current_version.nil? || current_version != expected_version
end

def not_loading_already_seeded
  PrimeroDatabase.instance.connection.close
  puts('Not loading: PRIMERO_CONFIGURATION_RUN_SCRIPTS != true; Primero is already seeded')
end

def not_loading_pinned_version
  PrimeroDatabase.instance.connection.close
  puts("Not loading: Primero configuration is pinned to #{ENV.fetch('PRIMERO_CONFIGURATION_FILE_VERSION', nil)}")
end

def usage
  puts 'Usage: load_configuration path/to/configuration/script.rb'
end

unless ARGV.length.positive? && File.exist?(ARGV[0])
  usage
  return
end

unless check_not_seeded
  not_loading_already_seeded
  return
end

unless check_configuration_file_version
  not_loading_pinned_version
  return
end

require_relative '../config/environment'
require ARGV[0]
SystemSettings.current.update(configuration_file_version: ENV.fetch('PRIMERO_CONFIGURATION_FILE_VERSION', nil))
