#Destroy all exiting locations
Location.all.all.each{ |l| l.destroy }


#TODO: Temporarily load all the other locations code in this directory
#Dir[File.dirname(__FILE__) + '/locations_*.rb'].each {|file| require file}
require "#{File.dirname(__FILE__)}/locations_sierra_leone.rb"

#TODO: Add default location setting code here, if that make sense.