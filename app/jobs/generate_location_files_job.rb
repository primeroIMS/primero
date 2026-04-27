# frozen_string_literal: true

# Generate the Locations JSON file that will be served up by Primero
class GenerateLocationFilesJob < ApplicationJob
  queue_as :options

  def perform
    GenerateLocationFilesService.generate
  end
end
