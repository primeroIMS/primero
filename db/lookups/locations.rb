#Destroy all exiting locations
Location.all.all.each{ |l| l.destroy }


#TODO: Temporarily load all the other locations code in this directory
#Dir[File.dirname(__FILE__) + '/locations_*.rb'].each {|file| require file}

#TODO: Add default location setting code here, if that make sense.
require File.dirname(__FILE__) + "/locations_sierra_leone.rb"
require File.dirname(__FILE__) + "/locations_liberia.rb"
require File.dirname(__FILE__) + "/locations_guinea.rb"