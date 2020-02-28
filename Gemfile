source 'https://rubygems.org'
ruby '2.4.3'

gem 'rapidftr_addon', :git => 'https://github.com/rapidftr/rapidftr-addon.git', :branch => 'master'
gem 'rapidftr_addon_cpims', :git => 'https://github.com/rapidftr/rapidftr-addon-cpims.git', :branch => 'master'

gem 'couchrest_model', '2.0.4'

gem 'mime-types',     '1.16'
gem 'mini_magick',    '~> 4.9.4'
gem 'pdf-reader',     '2.0.0'
gem 'prawn',          '~> 2.2.2'
gem 'prawn-table',    '~> 0.2.2'
gem 'rails',          '5.1.6.2'
gem 'uuidtools',      '~> 2.1.1'
gem 'validatable',    '1.6.7'
gem 'dynamic_form',   '~> 1.1.4'
gem 'rake',           '~> 12.3.0'
gem 'jquery-rails'

#TODO - keeping cancancan at 1.9.2 for now.  Newer versions seem to break.
gem 'cancancan',      '~> 1.9.2'
gem 'highline',       '~> 1.7.8'
gem 'will_paginate',  '~> 3.1.0'
gem 'i18n-js',        '~> 3.0.1'
gem 'therubyracer',   '~> 0.12.2', :platforms => :ruby, :require => 'v8'
gem 'os',             '~> 1.0.0'
gem 'multi_json',     '~> 1.12.2'
gem 'addressable',    '~> 2.5.2'
gem 'rubyzip',        '~> 1.3.0', require: 'zip'

gem 'sunspot_rails',  '2.3.0'
gem 'sunspot_solr',   '2.3.0'

gem 'rufus-scheduler', '~> 3.4.2', :require => false
gem 'daemons',         '~> 1.2.5',  :require => false

gem 'backburner', require: false

#TODO - Going to more recent version of foundation-rails throws off our layouts
gem 'foundation-rails', '~> 6.3.0.0'

gem 'sass-rails',    '~> 5.0.6'
gem 'coffee-rails',  '~> 4.2.2'
gem 'chosen-rails',  '~> 1.5.2'
gem 'ejs', '~> 1.1.1'

gem 'yui-compressor'
gem 'closure-compiler', '1.1.13'
gem 'progress_bar', '~> 1.1.0'

gem 'writeexcel', '~> 1.0.5'
gem 'spreadsheet', '~> 1.1.5'
gem 'deep_merge', :require => 'deep_merge/rails_compat'
gem 'memoist', '~> 0.11.0'

gem 'momentjs-rails', '~> 2.17.1'

gem 'turbolinks', '5.1.0'
gem 'turbolinks-source', '5.1.0'
gem 'jquery-turbolinks'
gem 'arabic-letter-connector', :git => 'https://github.com/Quoin/arabic-letter-connector', :branch => 'support-lam-alef-ligatures'
gem 'twitter_cldr'

gem 'rack', '~> 2.0.8'

#Security assertions:
gem "nokogiri", ">= 1.10.4"

group :production do
  #TODO - Do not upgrade passenger
  gem 'passenger', '4.0.59', require: false
end

#TODO: Are these getting installed?
group :development, :assets, :cucumber do
  gem 'uglifier',      '~> 4.0.2'
end

group :development do
  gem 'i18n-tasks', '~> 0.9.18'
  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'ruby-prof'
  gem 'request_profiler', :git => 'https://github.com/justinweiss/request_profiler.git'
  gem 'rack-mini-profiler', '>= 1.0.0', require: false
  gem 'memory-profiler'
  gem 'letter_opener'
end

group :test, :cucumber, :development do
  gem 'puma', '~> 3.12'
  gem 'pry'
  gem 'pry-byebug'
  gem 'sunspot_test', require: false
end

group :test, :cucumber do
  gem 'rails-controller-testing',   '~> 1.0.2'
  gem 'factory_bot',                '~> 4.8.2'
  gem 'rspec-activemodel-mocks',    '~> 1.0.3'
  gem 'rspec-collection_matchers',  '~> 1.1.3'
  gem 'rspec',                      '~> 3.7.0'
  gem 'rspec-rails',                '~> 3.7.2'
  gem 'rspec-instafail',            '~> 1.0.0'
  gem 'jasmine',                    '~> 2.4.0'   #TODO ????
  gem 'capybara',                   '~> 2.16.1'
  gem 'selenium-webdriver',         '~> 3.7.0'
  gem 'capybara-selenium',          '~> 0.0.6'
  gem 'chromedriver-helper'
  gem 'hpricot'
  gem 'json_spec'
  gem 'rubocop'
  gem 'simplecov',                  '~> 0.15.1'
  gem 'simplecov-rcov',             '~> 0.2.3'
  gem 'ci_reporter'
  gem 'pdf-inspector', :require => 'pdf/inspector'
  gem 'rack_session_access'
  # TODO: Latest version (1.2.5) of this conflicts with sunspot gem. We should be able to upgrade when we upgrade sunspot
  gem 'tzinfo',                     '1.2.4'
  gem 'timecop',                    '~>0.9.1'
end

#TODO: Does this get installed?
group :couch_watcher do
  gem 'em-http-request',    '~> 1.1.2'
  gem 'eventmachine',       '~> 1.2.5'
end
