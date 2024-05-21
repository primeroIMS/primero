# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Service for approval request notification logic
class ApprovalRequestNotificationService < ApprovalNotificationService
  def key
    'approval_request'
  end

  def locale
    @locale ||= manager&.locale || I18n.locale
  end
end
