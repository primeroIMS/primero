# frozen_string_literal: true

# Job that sends a custom email to a set of users selected from the users list
class BulkUserEmailJob < ApplicationJob
  queue_as :long_running_process

  def perform(sender_id, args = {})
    args = args.with_indifferent_access
    sender = User.find(sender_id)
    BulkUserEmailService.new(sender, args[:subject], args[:message], args).send_emails!
  end
end
