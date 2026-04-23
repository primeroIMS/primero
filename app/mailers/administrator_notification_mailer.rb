# frozen_string_literal: true

# Sends email notifications for Administrator
class AdministratorNotificationMailer < ApplicationMailer
  def notify(notification_type)
    @maximum_attachments_space = SystemSettings.maximum_attachments_space
    return unless @maximum_attachments_space.positive?

    @locale = I18n.locale
    @notification_type = notification_type
    @full_name = @system_admin&.name
    @subject = I18n.t("email_notification.#{notification_type}_subject", system_name: @theme.system_name)

    mail(to: email_address_with_name(@system_admin.email, @system_admin.name), subject: @subject)
  end
end
