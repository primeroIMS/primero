# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Job that updates associated records for a user
class AssociatedRecordsJob < ApplicationJob
  queue_as :long_running_process

  def perform(args = {})
    AssociatedRecordsService.new(
      args.except(:user_id, :model).merge(user: User.find(args[:user_id]), model: args[:model].constantize)
    ).update_associated_records
  end
end
