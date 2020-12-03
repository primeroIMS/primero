# frozen_string_literal: true

# Job to send out email for transfer requests
class RequestTransferJob < ApplicationJob
  queue_as :mailer

  def perform(transfer_request_id)
    NotificationMailer.transfer_request(transfer_request_id).deliver_now
  end
end
