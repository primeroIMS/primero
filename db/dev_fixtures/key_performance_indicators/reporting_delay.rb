# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require_relative 'setup'

#  create 100 incidents with repotting delay (very) roughly distributed
# about 5 days.
101.times do |_index|
  days = sample_box_muller(1, 365, 5, 5).round
  puts "Creating incident with date #{days} days in the past"
  Incident.new_with_user(TEST_USER, {
                           incident_date: Date.today.prev_day(days)
                         }).save!
end

puts 'Created 100 incidents with between 1 and 365 days reporting delay'
