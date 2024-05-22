# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Primero ActiveJob superclass
class PeriodicJob < ActiveJob::Base
  queue_as :long_running_process
  def perform
    return unless self.class.perform_job?

    self.class.schedule_job
    perform_rescheduled
  end

  def perform_rescheduled
    raise NotImplementedError
  end

  def self.perform_job?
    Delayed::Job.where('handler LIKE :job_class', job_class: "%job_class: #{name}%")
                .where(run_at: Time.now..)
                .empty?
  end

  def self.reschedule_after
    1.day
  end

  def self.schedule_job
    set(wait: reschedule_after).perform_later
  end
end
