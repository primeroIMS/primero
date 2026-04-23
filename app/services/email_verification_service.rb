# frozen_string_literal: true

require 'mail_checker'

# Utility to verify email addresses
class EmailVerificationService
  def self.check_email(email)
    return unless Rails.configuration.disposable_email_checker_enabled
    return true if MailChecker.valid?(email)

    raise Errors::InvalidEmail, email
  end
end
