# frozen_string_literal: true

require 'yaml'
require 'pg'
require 'singleton'

# Raw PG connection to the Primero database.
# Call this class only in scripts
class PrimeroDatabase
  include Singleton

  MIGRATION_DATE_FORMAT = '%Y%m%d%H%M%S'

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

  def migrated?
    # TODO: This might need to change if primero moves to a different schema.
    missed_table = connection.exec(
      "SELECT 1 FROM information_schema.tables WHERE table_name = 'schema_migrations'"
    ).values.empty?
    return false if missed_table

    response = connection.exec('SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1')
    response[0]['version'] == last_migration_date
  end

  def last_migration_date
    migration_files = Dir.glob("#{File.dirname(__FILE__)}/../db/migrate/**.rb")
    migration_dates = migration_files.map { |path| path.scan(/[0-9]{14}/) }.flatten
    max_date = migration_dates.map { |migration_date| DateTime.strptime(migration_date, MIGRATION_DATE_FORMAT) }.max
    max_date.strftime(MIGRATION_DATE_FORMAT)
  end

  def configuration_file_version
    response = connection.exec('SELECT configuration_file_version FROM system_settings limit 1')
    return if response.values.length.zero?

    response[0]['configuration_file_version']
  end
end
