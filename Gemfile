# frozen_string_literal: true

source 'https://rubygems.org'
ruby '2.6.5'

gem 'activerecord-nulldb-adapter'      # Running Rake tasks at build time before DB is set up. TODO: Still needed?
gem 'arabic-letter-connector',         # Arabic letter connector for PDF exports
    git: 'https://github.com/Quoin/arabic-letter-connector',
    branch: 'support-lam-alef-ligatures'
gem 'backburner',          '~> 1.5'    # Ruby client for the Beanstalkd queue
gem 'cancancan',           '3.0.1'     # Endpoint user authorization
gem 'deep_merge',          '~> 1.2',   # Recursive merging of Hashes. Used for merging params to existing records.
    require: 'deep_merge/rails_compat'
gem 'devise',              '4.7.1'     # Authentication framework
gem 'devise-jwt',          '0.5.9'     # JWT authentication for native Primero users
gem 'faraday',             '~> 0.17'   # Ruby HTTP client
gem 'file_validators',     '~> 2.3'    # ActiveRecord extension for validating attachment file sizes
gem 'i18n-js',             '~> 3.4'    # Shares Rails i18n strings with the front end
gem 'jbuilder',            '~> 2.8'    # JSON templating for the API
gem 'mini_magick',         '~> 4.9.4'  # Ruby bindings for ImageMagick, resize attachments. TODO: Is this necessary?
gem 'minipack',            '~> 0.3'    # An alternative to Webpacker. TODO: Is this still needed? In prod?
gem 'net-http-persistent', '~> 3.1'    # Thread safe persistent HTTP connections, optional Faraday dependency
gem 'nokogiri',            '>= 1.10.4' # Security assertion on implicit dependency.
gem 'pg',                  '~> 1.1'    # Ruby PostgreSQL binding
gem 'prawn',               '~> 2.2'    # PDF generation
gem 'prawn-table',         '~> 0.2'    # PDF generation
gem 'puma',                '~> 4.3'    # Ruby Rack server
gem 'rack',                '~> 2.0'
gem 'rails',               '5.2.4'
gem 'rake',                '~> 12.3'
gem 'rbnacl',              '>= 7.1.1'  # Libsodium Ruby binding. Used for encrypting export file passwords.
gem 'rubyzip',             '~> 1.3.0', # Zip and encrypt exported files
    require: 'zip'
gem 'rufus-scheduler',     '~> 3.4',   # Primero, Rails-context job cron-like scheduling.
    require: false
gem 'spreadsheet',         '~> 1.1'    # Read XLS spreadsheets for imports (not XLSX!). TODO: Different gem? Reconsider?
# Note: if upgrading Sunspot, update the corresponding version of Solr on the Docker image
# Current Solr version is 5.3.1
gem 'sunspot_rails',       '2.3.0'     # Rails ODM bindings to Solr
gem 'sunspot_solr',        '2.3.0'     # Ruby bindings to Solr
gem 'twitter_cldr',        '~> 4.4'    # Localization for dates, money. TODO: Is this still used?
gem 'tzinfo',              '~> 1.2'    # Security assertion on implicit dependency.
gem 'tzinfo-data',         '~> 1.2019' # Security assertion on implicit dependency.
gem 'will_paginate',       '~> 3.1'    # Paginates ActiveRecord models  TODO: This can be refactored away.
# TODO: We should replace xls exporting with https://github.com/randym/axlsx or
# https://github.com/Paxa/fast_excel both supports streaming. The last options
# has less dependencies. Will require some rework of exporter
gem 'writeexcel',          '~> 1.0' # Exports XLS (not XLSX) documents. Stale!

group :development, :test do
  gem 'binding_of_caller',          '~> 0.8'
  gem 'bundler-audit',              '~> 0.6'
  gem 'ci_reporter',                '~> 2.0'
  gem 'factory_bot',                '~> 5.0'
  gem 'foreman'
  gem 'i18n-tasks',                 '~> 0.9'
  gem 'json_spec',                  '~> 1.1'
  gem 'letter_opener',              '~> 1.7'
  gem 'listen',                     '~> 3.1'
  gem 'memory-profiler',            '~> 1.0'
  gem 'pry'
  gem 'pry-byebug'
  gem 'rack-mini-profiler',         '>= 1.0.0', require: false
  gem 'rack-test',                  '~> 1.1'
  gem 'rack_session_access',        '~> 0.2'
  gem 'rails-controller-testing',   '~> 1.0'
  gem 'request_profiler',           '~> 0.0', git: 'https://github.com/justinweiss/request_profiler.git'
  gem 'rspec',                      '~> 3.8'
  gem 'rspec-activemodel-mocks',    '~> 1.1'
  gem 'rspec-collection_matchers',  '~> 1.1'
  gem 'rspec-instafail',            '~> 1.0'
  gem 'rspec-rails',                '~> 3.8'
  gem 'rubocop',                    '~> 0.67'
  gem 'rubocop-performance',        '~> 1.1'
  gem 'ruby-prof',                  '~> 0.17'
  gem 'simplecov',                  '~> 0.18'
  gem 'sunspot_test',               '~> 0.4', require: false
  # TODO: Latest version (1.2.5) of this conflicts with sunspot gem. Upgrade when we upgrade sunspot
  gem 'timecop',                    '~>0.9.1'
end