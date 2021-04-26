# frozen_string_literal: true

# Send a Primero configuration to another instance of Primero
class PrimeroConfigurationSyncJob < ApplicationJob
  queue_as :api

  def perform(configuration_id)
    configuration = PrimeroConfiguration.find_by(id: configuration_id)
    result = PrimeroConfigurationSyncService.sync!(configuration)
    result.present? && result[:status] >= 400 &&
      Rails.logger.error("Error syncing Primero Configuration with id #{configuration_id}. Status: #{result[:status]}")
  rescue StandardError => e
    Rails.logger.error("Error syncing Primero Configuration with id #{configuration_id}. Error: #{e.message}")
  end
end
