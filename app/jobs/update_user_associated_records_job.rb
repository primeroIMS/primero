# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Job that updates associated records for a user
class UpdateUserAssociatedRecordsJob < ApplicationJob
  queue_as :long_running_process

  def perform(args = {})
    AssociatedRecordsService.new(
      args.except(:user_id).merge(user: User.find(args[:user_id]))
    ).update_associated_records
  end
end
