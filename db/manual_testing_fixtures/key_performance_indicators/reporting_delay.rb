require_relative 'setup.rb'


# create 100 incidents with repotting delay (very) roughly distributed
# about 5 days.
def sample_box_muller(lower, upper, mean, standard_deviation)
  theta = 2 * Math::PI * rand()
  rho = Math.sqrt(-2 * Math.log(1 - rand()))
  scale = standard_deviation * rho
  return [[lower, mean + scale * Math.cos(theta)].max, upper].min
end

(0..100).each do |index|
  days = sample_box_muller(1, 365, 5, 5).round
  puts "Creating incident with date #{days} days in the past"
  Incident.new_with_user(TEST_USER, {
    incident_date: Date.today.prev_day(days)
  }).save!
end

puts 'Created 100 incidents with between 1 and 365 days reporting delay'
