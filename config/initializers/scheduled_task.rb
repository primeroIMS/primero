require 'rubygems'
require 'rufus/scheduler'

scheduler = Rufus::Scheduler.start_new

scheduler.every("24h") do
  Child.reindex!
  Incident.reindex!
end
