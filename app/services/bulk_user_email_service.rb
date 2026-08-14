# frozen_string_literal: true

# Sends a custom email from a sender to every permitted user matching the filters,
# writing an audit log entry per recipient.
class BulkUserEmailService
  BATCH_SIZE = 50

  attr_accessor :sender, :subject, :message, :filters

  def initialize(sender, subject, message, filters = {})
    self.sender = sender
    self.subject = subject
    self.message = message
    self.filters = filters.with_indifferent_access.except(:subject, :message)
  end

  def send_emails!
    recipients.find_in_batches(batch_size: BATCH_SIZE) do |batch|
      batch.each { |recipient| send_email(recipient) }
    end
  end

  private

  def send_email(recipient)
    return unless recipient.emailable?

    UserMailer.bulk_email(recipient.id, sender.id, subject, message).deliver_now
    audit_log!(recipient)
  rescue StandardError => e
    Rails.logger.error("BulkUserEmailService: failed to send email to user #{recipient.id}: #{e.message}")
  end

  def recipients
    PermittedUsersService.new(sender, activity_filters?).users_for_filters(filters).distinct
  end

  def activity_filters?
    User::AUDIT_LAST_DATE.keys.any? { |key| filters[key].present? }
  end

  def audit_log!(recipient)
    AuditLog.create(
      record: recipient,
      action: AuditLog::BULK_EMAIL,
      user_id: sender.id,
      metadata: { user_name: sender.user_name }
    )
  end
end
