#! /usr/bin/env ruby

require 'pg'
require 'singleton'
require 'yaml'

# Raw PG connection to the Primero database.
class PrimeroDatabase
  include Singleton

  attr_accessor :connection

  def initialize
    self.connection = PG.connect(connection_string(File.open("#{File.dirname(__FILE__)}/../config/database.yml")))
  end

  def connection_string(file)
    settings = YAML.safe_load(file)
    rails_env = ENV['RAILS_ENV'] || 'development'
    "host=#{settings[rails_env]['host']} " \
    "dbname=#{settings[rails_env]['database']} " \
    "user=#{settings[rails_env]['username']} " \
    "password=#{settings[rails_env]['password']} " \
    "sslmode=#{settings[rails_env]['sslmode'] || 'prefer'}"
  end

  def seeded?
    response = connection.exec('SELECT count(1) as count FROM system_settings')
    response[0]['count'].to_i.positive?
  end

  def configuration_file_version
    response = connection.exec('SELECT configuration_file_version FROM system_settings limit 1')
    return if response.values.length.zero?

    response[0]['configuration_file_version']
  end
end

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
