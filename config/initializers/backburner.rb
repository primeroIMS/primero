# frozen_string_literal: true

config_file = File.join(Rails.root, 'config', 'backburner.yml')
return unless File.exist?(config_file)

backburner_config = YAML.load_file(config_file)[Rails.env]
url = backburner_config&.[]('beanstalk_url')

logfile = if ENV['RAILS_LOG_PATH'].present? && ENV['LOG_TO_STDOUT'].blank?
            "#{ENV['RAILS_LOG_PATH']}/backburner.log"
          else
            STDOUT
          end

# Monkeypatch additional configuration options into Backburner
class Backburner::Configuration
  attr_accessor :max_startup_retries, :startup_delay
end

Backburner.configure do |config|
  config.beanstalk_url       = url if url.present?
  config.tube_namespace      = Rails.env
  config.namespace_separator = '_'
  config.max_startup_retries = 36 # monkeypatched, default 1 retry
  config.startup_delay       = 5 # monkeypatched, default 5 seconds
  config.max_job_retries     = 3 # default 0 retries
  config.retry_delay         = 5 # default 5 seconds
  config.default_priority    = 100
  config.respond_timeout     = 60 * 60 * 3 # Seconds. 2 hours to finish a queued job. Can't be 0!
  config.default_worker      = Backburner::Workers::Forking
  config.logger              = Logger.new(logfile, 5, 50.megabytes).tap { |l| l.level = Logger::INFO }
  config.primary_queue       = 'export'
  config.reserve_timeout     = nil
end
