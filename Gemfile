source 'https://rubygems.org'
ruby '2.6.2'

gem 'rails',            '5.2.3'
gem 'pg',               '~> 1.1'
gem 'rake',             '~> 12.3'
gem 'puma',             '~> 3.12'
gem 'webpacker',        '~> 4.0'
gem 'devise',           '4.6.2'

gem 'prawn',            '~> 2.2'
gem 'prawn-table',      '~> 0.2'
gem 'arabic-letter-connector', git: 'https://github.com/Quoin/arabic-letter-connector', branch: 'support-lam-alef-ligatures'
gem 'twitter_cldr'

gem 'rubyzip',          '~> 1.2', require: 'zip'
gem 'writeexcel',       '~> 1.0'
gem 'spreadsheet',      '~> 1.1'

gem 'cancancan',        '~> 1.9' # TODO: keeping cancancan at 1.9.2 for now. Newer versions seem to break.
gem 'will_paginate',    '~> 3.1'
gem 'mini_magick',      '~> 4.8'
gem 'i18n-js',          '~> 3.0'

gem 'rufus-scheduler',  '~> 3.4', require: false
gem 'backburner',       '~> 1.5', require: false
gem 'deep_merge', require: 'deep_merge/rails_compat'
gem 'tzinfo',           '1.2.4'

# Note: if upgrading Sunspot, update the corresonding version of Solr in Chef if necessaary.
# Current Solr version is 5.3.1
gem 'sunspot_rails',    '2.3.0'
gem 'sunspot_solr',     '2.3.0'

# TODO: Remove/reevaluate the following once UIUX rebuilt
gem 'therubyracer',     '~> 0.12', platforms: :ruby, require: 'v8'
gem 'jquery-rails'
gem 'ejs',              '~> 1.1.1'
gem 'foundation-rails', '~> 6.3.0.0' # NOTE: Don't update
gem 'sass-rails',       '~> 5.0.6'
gem 'compass-rails',    '~> 3.0.2'
gem 'chosen-rails',     '~> 1.5.2'
gem 'jquery-turbolinks'
gem 'turbolinks',       '~> 5'
gem 'momentjs-rails',   '~> 2.17.1'
gem 'yui-compressor'
gem 'closure-compiler'
gem 'uglifier',         '~> 4.0.2'
# ---

group :development, :test do
  gem 'i18n-tasks', '~> 0.9.18'
  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'ruby-prof'
  gem 'request_profiler', :git => 'https://github.com/justinweiss/request_profiler.git'
  gem 'rack-mini-profiler', '>= 1.0.0', require: false
  gem 'memory-profiler'
  gem 'letter_opener'
  gem 'foreman'
  gem 'pry'
  gem 'pry-byebug'
  gem 'sunspot_test', require: false
  gem 'rails-controller-testing',   '~> 1.0.2'
  gem 'factory_bot',                '~> 4.8.2'
  gem 'rspec-activemodel-mocks',    '~> 1.0.3'
  gem 'rspec-collection_matchers',  '~> 1.1.3'
  gem 'rspec',                      '~> 3.7.0'
  gem 'rspec-rails',                '~> 3.7.2'
  gem 'rspec-instafail',            '~> 1.0.0'
  gem 'hpricot'
  gem 'json_spec'
  gem 'rubocop'
  gem 'simplecov',                  '~> 0.15.1'
  gem 'simplecov-rcov',             '~> 0.2.3'
  gem 'ci_reporter'
  gem 'rack_session_access'
  # TODO: Latest version (1.2.5) of this conflicts with sunspot gem. We should be able to upgrade when we upgrade sunspot
  gem 'timecop',                    '~>0.9.1'

  # TODO: Remove/reevaluate the following once UIUX rebuilt
  gem 'pdf-inspector', :require => 'pdf/inspector'
  gem 'selenium-webdriver',         '~> 3.7.0'
  gem 'chromedriver-helper'
  gem 'capybara-selenium',          '~> 0.0.6'
  gem 'capybara',                   '~> 2.16.1'
  gem 'jasmine',                    '~> 2.4.0'   #TODO ????

  # TODO: We need to update to 0.8.3 as soon as its available
  # This is a temp thing. There is a recent (DEC 2017) bug in rack-test.
  # Should be able to just remove after a patch is released.
  # https://github.com/rack-test/rack-test/issues/211
  # https://github.com/rack-test/rack-test/pull/215
  gem 'rack-test', :git => 'https://github.com/rack-test/rack-test', :ref => '10042d3452a13d5f13366aac839b981b1c5edb20'
end
