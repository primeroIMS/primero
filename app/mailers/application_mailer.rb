# frozen_string_literal: true

# Superclass for all Mailers
class ApplicationMailer < ActionMailer::Base
  layout 'mailer'

  before_action :mail_allowed!

  rescue_from StandardError do |error|
    log_mailer_error(error)
  end

  def send_to_user_allowed!(user)
    true
  end

  def mail_allowed!
    SystemSettings.current.notification_email_enabled ||
      raise(Errors::MailNotConfiguredError)
  end

  def log_mailer_error(error)
    case error
    when ActiveRecord::RecordNotFound
      Rails.logger.error("Attempting to send an email for a record that doesn't exist: #{error.message}")
    when Errors::MailNotConfiguredError
      Rails.logger.debug('Email notification not sent because Primero is not configured to send mail!')
    end

  end
end