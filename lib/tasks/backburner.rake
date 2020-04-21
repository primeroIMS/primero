# frozen_string_literal: true

namespace :backburner do
  desc 'Start the Backburner worker after waiting for a Beanstalkd connection'
  task wait_then_work: :environment do
    puts "Waiting to start the Backburner worker connected to Beanstalkd on #{Backburner.configuration.beanstalk_url}"
    attempts = 0
    until HealthCheckService.beanstalkd_accessible?
      if attempts > (Backburner.configuration.max_startup_retries || 1)
        puts 'Could not connect to Beanstalkd! Terminating.'
        exit(1)
      end

      delay = Backburner.configuration.startup_delay || 5
      puts "Could not connect, waiting #{delay} seconds..."
      sleep(delay)
      attempts += 1
    end
    puts "Launching Backburner worker connected to Beanstalkd on #{Backburner.configuration.beanstalk_url}"
    Backburner.work get_queues
  end
end
