# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.
#
require 'mail_checker'

# Utility to verify email addresses
class EmailVerificationService
  def self.check_email(email)
    return true if MailChecker.valid?(email)

    raise Errors::InvalidEmail, email
  end
end
