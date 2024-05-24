# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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
