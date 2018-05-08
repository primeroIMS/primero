class RequestTransferJob < ApplicationJob
  queue_as :mailer

  def perform(record_class, record_id, user_id, request_transfer_notes, host_url)
    NotificationMailer.transfer_request(record_class, record_id, user_id, request_transfer_notes, host_url).deliver_later
  end
end