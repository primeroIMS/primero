# frozen_string_literal: true

# Service for approval request notification logic
class ApprovalRequestNotificationService < ApprovalNotificationService
  def key
    'approval_request'
  end

  def locale
    @locale ||= manager&.locale || I18n.locale
  end
end
