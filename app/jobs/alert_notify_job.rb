# frozen_string_literal: true

# Job for enqueuing notifications about changes to the User account
class AlertNotifyJob < ApplicationJob
  queue_as :mailer

  def perform(alert_id)
    alert = Alert.find(alert_id)
    record = alert.record
    users = record.associated_users
    users.each do |user|
      next if record.last_updated_by == user.user_name

      ans = AlertNotificationService.new(record.id, alert_id, user.user_name)
      RecordActionMailer.alert_notify(ans).deliver_now
    end
  end
end
