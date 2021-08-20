# frozen_string_literal: true

# Primero ActiveJob superclass
class PeriodicJob < ActiveJob::Base
  def perform
    self.class.schedule_job
    perform_rescheduled
  end

  def perform_rescheduled
    raise NotImplementedError
  end

  def self.reschedule_after
    1.day
  end

  def self.schedule_job
    set(wait: reschedule_after).perform_later
  end
end
