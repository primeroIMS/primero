# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Job to apply a saved Primero configuration sate
class ApplyConfigurationJob < ApplicationJob
  queue_as :long_running_process

  def perform(configuration_id, user_id)
    configuration = PrimeroConfiguration.find_by(id: configuration_id)
    user = User.find_by(id: user_id)
    return unless configuration && user

    configuration.apply_with_api_lock!(user)
  end
end
