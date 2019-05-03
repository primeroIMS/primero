# frozen_string_literal: true

# This file is copied to spec/ when you run 'rails generate rspec:install'
if ENV['COVERAGE'] == 'true'
  require 'simplecov'
  require 'simplecov-rcov'
  SimpleCov.formatter = SimpleCov::Formatter::RcovFormatter
  SimpleCov.start 'rails'
  SimpleCov.coverage_dir 'coverage/rspec'
end

ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../config/environment', __dir__)
require 'rspec/rails'
require 'csv'
require 'active_support/inflector'
require 'sunspot/rails/spec_helper'
require 'sunspot_test/rspec'
require 'capybara/rails'
require 'selenium/webdriver'
require 'rack_session_access/capybara'

# Requires supporting ruby files with custom matchers and macros, etc,
# in spec/support/ and its subdirectories.
Dir[Rails.root.join('spec/support/**/*.rb')].each { |f| require f }

# This clears couchdb between tests.
Mime::Type.register 'application/zip', :mock

Capybara.register_driver :chrome do |app|
  Capybara::Selenium::Driver.new(app, browser: :chrome)
end

Capybara.register_driver :headless_chrome do |app|
  capabilities = Selenium::WebDriver::Remote::Capabilities.chrome(
    'chromeOptions' => { args: %w[headless no-sandbox disable-gpu window-size=1280,1024] }
  )

  Capybara::Selenium::Driver.new app,
                                 browser: :chrome,
                                 desired_capabilities: capabilities
end

Capybara.register_server :puma do |app, port, host|
  require 'rack/handler/puma'
  Rack::Handler::Puma.run(app, Port: port, Host: host)
end

Capybara.server = :puma
Capybara.default_driver = :headless_chrome
Capybara.default_max_wait_time = 6 # In seconds
Capybara.javascript_driver = :headless_chrome
Capybara.page.driver.browser.manage.window.resize_to(2000, 2000)

module VerifyAndResetHelpers
  def verify(object)
    RSpec::Mocks.space.proxy_for(object).verify
  end

  def reset(object)
    RSpec::Mocks.space.proxy_for(object).reset
  end
end

RSpec.configure do |config|
  config.include Capybara::DSL
  config.include FactoryBot::Syntax::Methods
  config.include UploadableFiles
  config.include ChildFinder
  config.include FakeLogin, type: :controller
  config.include VerifyAndResetHelpers
  config.include Conflicts
  config.include CapybaraHelpers

  config.formatter = :progress

  # Cleaner backtrace for failure messages
  config.backtrace_exclusion_patterns = [
    %r{/lib\d*/ruby/},
    %r{bin/},
    /gems/,
    %r{spec/spec_helper\.rb},
    %r{lib/rspec/(core|expectations|matchers|mocks)}
  ]
  # ## Mock Framework
  #
  # If you prefer to use mocha, flexmock or RR, uncomment the appropriate line:
  #
  # config.mock_with :mocha
  # config.mock_with :flexmock
  # config.mock_with :rr
  #

  config.expect_with :rspec do |expectations|
    expectations.syntax = %i[should expect]
  end

  config.mock_with :rspec do |mocks|
    mocks.syntax = %i[should expect]
    mocks.allow_message_expectations_on_nil = true
  end

  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  # config.fixture_path = "#{::Rails.root}/spec/fixtures"

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  # config.use_transactional_fixtures = true

  # If true, the base class of anonymous controllers will be inferred
  # automatically. This will be the default behavior in future versions of
  # rspec-rails.
  config.infer_base_class_for_anonymous_controllers = true
  config.infer_spec_type_from_file_location!

  config.formatter = :progress

  config.infer_spec_type_from_file_location!

  # Run specs in random order to surface order dependencies. If you find an
  # order dependency and want to debug it, you can fix the order by providing
  # the seed, which is printed after each run.
  #     --seed 1234
  config.order = 'random'

  # Recreate db if needed.
  config.before(:suite) do
    FactoryBot.find_definitions
    if OptionsQueueStats.options_not_generated?
      FactoryBot.create(:system_settings)
      FactoryBot.create(:location)
      OptionsJob.perform_now
    end

  end

  # Delete db if needed.
  config.after(:suite) do
  end

  config.before(:each) { I18n.locale = I18n.default_locale = :en }
  config.before(:each) { I18n.available_locales = Primero::Application.locales }

  config.before(:each) do |example|
    unless example.metadata[:search]
      ::Sunspot.session = ::Sunspot::Rails::StubSessionProxy.new(::Sunspot.session)
    end
  end

  config.after(:each) do |example|
    unless example.metadata[:search]
      ::Sunspot.session = ::Sunspot.session.original_session
    end
  end

  #########################
  # Couch Changes Config ##
  # #######################
  config.filter_run_excluding event_machine: true unless ENV['ALL_TESTS']
  config.include EventMachineHelper, :event_machine
  config.extend EventMachineHelper, :event_machine
end

def stub_env(new_env)
  original_env = Rails.env
  Rails.instance_variable_set('@_env', ActiveSupport::StringInquirer.new(new_env))
  yield
ensure
  Rails.instance_variable_set('@_env', ActiveSupport::StringInquirer.new(original_env))
end
