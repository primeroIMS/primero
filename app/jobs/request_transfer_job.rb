class RequestTransferJob < ApplicationJob
  queue_as :mailer

  def perform(transfer_request_id)
    NotificationMailer.transfer_request(transfer_request_id).deliver_later
  end
end