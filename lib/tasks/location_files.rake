namespace :location_files do
  desc "Generate options to file in public directory"
  task :generate => :environment do |t, args|
    GenerateLocationFilesService.generate
  end
end