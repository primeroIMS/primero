# frozen_string_literal: true

# Service for approval response notification logic
class ApprovalResponseNotificationService < ApprovalNotificationService
  def key
    'approval_response'
  end

  def approval
    return I18n.t('approvals.status.approved', locale:) if approved

    I18n.t('approvals.status.rejected', locale:)
  end

  def locale
    @locale ||= owner&.locale || I18n.locale
  end
end
