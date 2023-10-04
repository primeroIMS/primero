# frozen_string_literal: true

# Job for enqueuing notifications about changes to the User account
class AlertNotifyJob < ApplicationJob
  queue_as :mailer

  def perform(alert_id, user_id)
    alert = Alert.find(alert_id)
    user = User.find(user_id)
    record = alert.record
    # We never want to send an email to the user who made the change
    return if record.last_updated_by == user.user_name

    ans = AlertNotificationService.new(record.id, alert_id, user.user_name)
    RecordActionMailer.alert_notify(ans).deliver_now
    RecordActionWebpushNotifier.alert_notify(ans)
  end
end
