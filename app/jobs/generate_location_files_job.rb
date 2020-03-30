class GenerateLocationFilesJob < ApplicationJob
  queue_as :options

  def perform
    GenerateLocationFilesService.generate
  end
end
