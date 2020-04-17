# frozen_string_literal: true

namespace :db do
  desc 'Confirm that all PostgreSQL extensions in schema.rb are already installed in the database'
  task confirm_postgres_extensions: :environment do
    schema_rb = File.join(Rails.root, 'db', 'schema.rb')
    extensions_schema = File.open(schema_rb).grep(/enable_extension/)&.map { |e| e&.split&.second&.gsub('"', '') }
    extensions_db = ActiveRecord::Base&.connection&.execute('SELECT * from pg_extension;')&.values&.map(&:first)
    missing_extensions = extensions_schema - extensions_db
    if missing_extensions.size.positive?
      error_message = 'ERROR: The following PostgreSQL extansions need to be enabled for ' \
                      "Primero to run: #{missing_extensions}"
      abort(error_message)
    end

    puts "All expected PostgreSQL extensions installed:  #{extensions_schema}"
  end
end
