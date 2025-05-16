# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

source 'https://rubygems.org'
ruby '3.3.8'

gem 'activerecord-nulldb-adapter'      # Running Rake tasks at build time before DB is set up. TODO: Still needed?
gem 'activerecord-session_store', '~> 2.0'
gem 'aws-sdk-s3',          '~> 1.130', # Access and manage Amazon S3 storage (with ActiveStorage).
    require: false
gem 'azure-storage-blob',  '~> 1.1',   # Access and manage Microsoft Azure Storage Blob Services (with ActiveStorage).
    require: false
gem 'cancancan',           '~> 3.5'    # Endpoint user authorization
# TODO: concurrent-ruby v1.3.5 has removed the dependency on logger.
# TODO: https://stackoverflow.com/a/79361034
# TODO: Remove this dependency when upgrading to rails 7.x
gem 'concurrent-ruby',     '1.3.4'
gem 'csv-safe',            '~> 3.2'    # Safely export data to CSV to avoid formula injection
gem 'daemons',             '~> 1.4.1'  # Gem to run the delayed jobs
gem 'deep_merge',          '~> 1.2',   # Recursive merging of Hashes. Used for merging params to existing records.
    require: 'deep_merge/rails_compat'
gem 'delayed_job_active_record', '~> 4.1.7'
gem 'devise',              '~> 4.9'    # Authentication framework
gem 'faraday',             '~> 0.17'   # Ruby HTTP client
gem 'file_validators',     '~> 3.0'    # ActiveRecord extension for validating attachment file sizes
gem 'i18n-js',             '~> 3.9'    # Shares Rails i18n strings with the front end
gem 'image_processing',    '~> 1.12'   # Ruby bindings for ImageMagick, resize attachments. Depenency of ActiveStorage
gem 'jbuilder',            '~> 2.11'   # JSON templating for the API
gem 'json_schemer',        '~> 1.0'    # Validation for submited JSON
gem 'jwt',                 '~> 2.8'    # Ruby JWT library used to authenticate 3rd party identity provider tokens
gem 'matrix',              '~> 0.4'    # No longer part of Ruby 3.2 core. Must be included explicitly
gem 'minipack',            '~> 0.3'    # An alternative to Webpacker. TODO: Is this still needed? In prod?
gem 'net-http-persistent', '~> 4.0'    # Thread safe persistent HTTP connections, optional Faraday dependency
gem 'nokogiri',            '~> 1.18'   # Security assertion on implicit dependency.
gem 'pg',                  '~> 1.5'    # Ruby PostgreSQL binding
gem 'prawn',               '~> 2.4'    # PDF generation
gem 'prawn-table',         '~> 0.2'    # PDF generation
gem 'puma',                '~> 6.4'    # Ruby Rack server
gem 'rack',                '~> 2.2'
gem 'rack-attack',         '>= 6.6'    # Rack middleware to rate limit sensetive routes, such as those used for auth
gem 'rails',               '6.1.7.10'
gem 'rake',                '~> 13.0'
gem 'rbnacl',              '>= 7.1.1'  # Libsodium Ruby binding. Used for encrypting export file passwords.
gem 'rubyzip',             '~> 2.3',   # Zip and encrypt exported files
    require: 'zip'
gem 'spreadsheet',         '~> 1.3'    # Read XLS spreadsheets for imports (not XLSX!). TODO: Different gem? Reconsider?
# Note: if upgrading Sunspot, update the corresponding version of Solr on the Docker image
# Current Solr version is 5.3.1
gem 'sunspot_rails',       '~> 2.6',    # Rails ODM bindings to Solr
    require: false
gem 'sunspot_solr',        '~> 2.6',    # Ruby bindings to Solr
    require: false
gem 'text',                '~> 1.3'    # Phonetic Search Algorithms
gem 'twitter_cldr',        '~> 4.4'    # Localization for dates, money. TODO: Is this still used?
gem 'tzinfo-data',         '~> 1.2023' # Timezone Data for TZInfo
gem 'uri',                 '~> 0.13'   # CVE-2025-27221
gem 'web-push',            '~> 3.0'
gem 'will_paginate',       '~> 4.0'    # Paginates ActiveRecord models  TODO: This can be refactored away.
gem 'write_xlsx',          '~> 1.11'   # Exports XLSX

group :development, :test do
  gem 'brakeman', require: false
  gem 'bundler-audit',              '~> 0.9'
  gem 'ci_reporter',                '~> 2.0'
  gem 'factory_bot',                '~> 5.0'
  gem 'foreman'
  gem 'i18n-tasks',                 '~> 0.9'
  gem 'json_spec',                  '~> 1.1'
  gem 'letter_opener',              '~> 1.7'
  gem 'listen',                     '~> 3.1'
  gem 'memory_profiler'
  gem 'pry'
  gem 'pry-byebug'
  gem 'rack-mini-profiler',         '>= 1.0.0', require: false
  gem 'rack_session_access',        '~> 0.2'
  gem 'rack-test',                  '~> 1.1'
  gem 'rails-controller-testing',   '~> 1.0'
  # TODO: This is needed to read .xlsx files for validation in the exporter tests.
  # TODO: The app currently uses Spreadsheet to read excel files, but it only supports reading .xls
  # TODO: Changing the application to support reading .xlsx will be handled by a later ticket
  gem 'roo',                        '~> 2.9'
  gem 'rspec',                      '~> 3.12'
  gem 'rspec-activemodel-mocks',    '~> 1.1'
  gem 'rspec-collection_matchers',  '~> 1.2'
  gem 'rspec-instafail',            '~> 1.0'
  gem 'rspec-rails',                '~> 6.0'
  gem 'rubocop',                    '~> 1.54'
  gem 'rubocop-performance',        '~> 1.18'
  gem 'ruby-lsp',                   '~> 0.17'
  gem 'simplecov',                  '~> 0.18'
  # TODO: Latest version (1.2.5) of this conflicts with sunspot gem. Upgrade when we upgrade sunspot
  gem 'sunspot_test',               '~> 0.4', require: false
end
