# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# Sends email notifications for Administrator
class AdministratorNotificationMailer < ApplicationMailer
  def notify(notification_type)
    @maximum_attachments_space = SystemSettings.maximum_attachments_space
    return unless @maximum_attachments_space.positive?

    @locale = I18n.locale
    @notification_type = notification_type
    @full_name = @system_admin&.name
    @subject = I18n.t("email_notification.#{notification_type}_subject", system_name: @theme.system_name)

    mail(to: @system_admin.email, subject: @subject)
  end
end
