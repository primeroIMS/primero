namespace :rspec do
  require 'ci/reporter/rake/rspec'

  desc 'Runs the rspec tests and generates xml reports that can be read by Jenkins'
  task :ci => "ci:setup:rspec" do
    sh "bundle exec rspec spec --format CI::Reporter::RSpec"
  end
end
