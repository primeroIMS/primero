# We assume that bundle exec rails db:seed has already been run and that
# this file is run with bundle exec rails r <filename>

# The number of incidents KPI requires:
# * Locations
# * Users with locations
# * Incidents created by users with location

require_relative './setup.rb'

Incident.new_with_user(TEST_USER, {
  # TODO: Find out what attributes go in an Incident and use
  #       some defaults here
  incident_date: Date.today.prev_day(6)
}).save!

puts 'Created test incident for NumberOfCases KPI'
