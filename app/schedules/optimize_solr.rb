# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# PeriodicJob to re-optimze the Sunspot Solr index.
class OptimizeSolr < PeriodicJob
  def perform_rescheduled
    Rails.logger.info 'Optimizing Solr...'
    Sunspot.optimize
  rescue StandardError
    Rails.logger.error 'Error optimizing Solr'
    raise
  end

  def self.reschedule_after
    1.day
  end
end
