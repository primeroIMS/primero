# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Job to send an email when an approval response has been granted
class ApprovalResponseJob < ApplicationJob
  queue_as :mailer

  def perform(record_id, approved, approval_type, approved_by)
    approval_notification = ApprovalResponseNotificationService.new(record_id, approval_type, approved_by, approved)
    RecordActionMailer.manager_approval_response(approval_notification).deliver_now
    RecordActionWebpushNotifier.manager_approval_response(approval_notification)
  end
end
