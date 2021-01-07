# frozen_string_literal: true

namespace :location_files do
  desc 'Generate options to file in public directory'
  task generate: :environment do
    GenerateLocationFilesService.generate
  end
end
