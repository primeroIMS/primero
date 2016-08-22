#TODO: This is a Rails 4.0 backport of the ActiveJob library that is part of the core in Rails 4.2+
#      When upgarding to the future rails version the jobs code will need to be
#      refactored and the backport gem pulled out.

require 'active_job'

adapter = if Rails.env == 'production'
  :backburner
else
  :inline
end


ActiveJob::Base.queue_adapter = adapter # default queue adapter
# Adapters currently supported: :backburner, :delayed_job, :qu, :que, :queue_classic,
#                               :resque, :sidekiq, :sneakers, :sucker_punch