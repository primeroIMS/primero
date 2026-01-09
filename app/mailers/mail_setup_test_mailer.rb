# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Send an email to confirm that Primero is correctly set up
class MailSetupTestMailer < ActionMailer::Base
  helper :application

  def mail_setup_test(to_email, full_name = nil)
    host = ActionMailer::Base.default_url_options[:host]
    system_settings = SystemSettings.current
    version = system_settings.primero_version
    message = 'Confirming that the Primero action mailer is configured to send emails! ' \
              "Running Primero Server #{version} on #{host}."
    recipient = full_name.present? ? email_address_with_name(to_email, full_name) : to_email
    mail(to: recipient,
         body: message,
         content_type: 'text/html',
         subject: "Mailer confirmation: #{host}")
  end
end
