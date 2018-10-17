namespace :options do
  desc "Generate options to file in public directory"
  task :generate => :environment do |t, args|
    OptionsJob.perform_now
  end
end