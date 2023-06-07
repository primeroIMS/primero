# frozen_string_literal: true

# Job that updates associated records for a user
class AssociatedRecordsJob < ApplicationJob
  queue_as :api

  def perform(args = {})
    AssociatedRecordsService.new(
      args.except(:user_id, :model).merge(user: User.find(args[:user_id]), model: args[:model].constantize)
    ).update_associated_records
  end
end
