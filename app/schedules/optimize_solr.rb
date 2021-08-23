# frozen_string_literal: true

# Nightly schedule to re-optimze the Sunspot Solr index.
# Runs nightly at 02:01 am UTC (or server time)
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
