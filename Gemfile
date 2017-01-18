source 'https://rubygems.org'
ruby '2.1.5'

gem 'rapidftr_addon', :git => 'https://github.com/rapidftr/rapidftr-addon.git', :branch => 'master'
gem 'rapidftr_addon_cpims', :git => 'https://github.com/rapidftr/rapidftr-addon-cpims.git', :branch => 'master'

gem 'couchrest_model', '~> 2.0.3', :git => "https://github.com/Quoin/couchrest_model.git", :ref => "72b801720ff225e5615db13bdbe9c7b8962ef13e"
gem 'mime-types',     '1.16'
gem 'mini_magick',    '1.3.2'
gem 'pdf-reader',     '1.3.3'
gem 'prawn',          '~> 1.2.1'
gem 'prawn-table',    '~> 0.1.1'
gem 'rails',          '4.0.13'
gem 'uuidtools',      '~> 2.1.1'
gem 'validatable',    '1.6.7'
gem 'dynamic_form',   '~> 1.1.4'
gem 'rake',           '0.9.3'
gem 'jquery-rails'
gem 'cancancan', '~> 1.7'
gem 'capistrano',     '~> 2.14.2'
gem 'highline',       '1.6.16'
gem 'will_paginate',  '~> 3.0.5'
gem 'i18n-js',        '~> 2.1.2'
gem 'therubyracer',   '~> 0.12.2', :platforms => :ruby, :require => 'v8'
gem 'os',             '~> 0.9.6'
gem 'thin',           '~> 1.6.1', :platforms => :ruby, :require => false
gem 'request_exception_handler'
gem 'multi_json',     '~> 1.8.2'
gem 'addressable',    '~> 2.3.6'
gem "zipruby-compat", :require => 'zipruby', :git => "https://github.com/jawspeak/zipruby-compatibility-with-rubyzip-fork.git", :tag => "v0.3.7"

gem 'sunspot_rails',  '2.1.1'
gem 'sunspot_solr',   '2.1.1'

gem 'rufus-scheduler', '~> 2.0.18', :require => false
gem 'daemons',         '~> 1.1.9',  :require => false

gem 'activejob_backport'
gem 'backburner', require: false

gem 'foundation-rails', '~> 5.5.3.2'

gem 'sass-rails',    '~> 5.0.4'
gem 'compass-rails', '~> 2.0.1'
gem 'coffee-rails',  '~> 4.0.1'
gem 'chosen-rails',  '~> 1.1.0'
gem 'ejs', '~> 1.1.1'

gem 'rack-mini-profiler', require: false

gem 'yui-compressor'
gem 'closure-compiler'
gem 'progress_bar'

gem 'writeexcel', '~> 1.0.3'
gem 'spreadsheet',        '~> 1.0.0'
gem "deep_merge", :require => 'deep_merge/rails_compat'
gem 'memoist', '~> 0.11.0'

gem 'momentjs-rails', '~> 2.10.3'

#TODO: Are these getting installed?
group :development, :assets, :cucumber do
  gem 'uglifier',      '~> 2.0.1'
end

group :development do
  gem "better_errors"
  gem "binding_of_caller"
  gem 'ruby-prof'
  gem 'request_profiler', :git => "git://github.com/justinweiss/request_profiler.git"
end

group :test, :cucumber, :development do
  gem 'pry'
  gem 'pry-byebug'
  gem 'sunspot_test', require: false
end

group :test, :cucumber do
  gem 'factory_girl',     '~> 2.6'

  gem 'rspec',            '~> 2.14.1'
  gem 'rspec-rails',      '~> 2.14.1'
  gem 'rspec-instafail',  '~> 0.2.4'
  gem 'jasmine',          '~> 1.3.2'

  gem 'capybara',         '~> 2.2.1'
  gem 'cucumber',           '~> 1.3.11'
  gem 'cucumber-rails',     '~> 1.4.0', :require => false
  gem 'selenium-webdriver', '~> 2.43.0'
  gem 'hpricot',            '~> 0.8.6'
  gem "json_spec",          '~> 1.1.1'
  gem 'rubocop'
  gem 'metric_fu'
  gem 'simplecov',          '~> 0.8.2'
  gem 'simplecov-rcov',     '~> 0.2.3'
  gem 'ci_reporter',        '~> 1.9.1'
  gem "pdf-inspector",      '~> 1.1.0', :require => 'pdf/inspector'
end

#TODO: Does this get installed?
group :couch_watcher do
  gem 'em-http-request',    '~> 1.1.2'
  gem 'eventmachine',       '~> 1.0.4'
end
