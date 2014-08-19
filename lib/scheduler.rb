require 'rubygems'
require 'rufus/scheduler'

module Scheduler
	extend ActiveSupport::Concern

	scheduler = Rufus::Scheduler.start_new

	module ClassMethods
	  def schedule(scheduler)
	    scheduler.every("24h") do
	      self.reindex!
	    end
	  end
	end
end