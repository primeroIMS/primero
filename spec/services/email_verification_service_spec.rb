# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

require 'rails_helper'

describe EmailVerificationService do
  before do
    Rails.configuration.disposable_email_checker_enabled = true
  end

  it 'returns true if the email is valid' do
    expect(EmailVerificationService.check_email('test@gmail.com')).to be(true)
  end

  it 'returns true for other valid email formats' do
    expect(EmailVerificationService.check_email('user@example.org')).to be(true)
    expect(EmailVerificationService.check_email('test.email@domain.co.uk')).to be(true)
  end

  it 'raises an error for invalid emails from blacklisted domains' do
    expect { EmailVerificationService.check_email('test@0-mail.com') }.to raise_error(Errors::InvalidEmail,
                                                                                      'test@0-mail.com')
  end

  it 'raises an error for malformed emails' do
    expect do
      EmailVerificationService.check_email('invalid.email')
    end.to raise_error(Errors::InvalidEmail, 'invalid.email')
    expect { EmailVerificationService.check_email('@domain.com') }.to raise_error(Errors::InvalidEmail, '@domain.com')
    expect { EmailVerificationService.check_email('user@') }.to raise_error(Errors::InvalidEmail, 'user@')
  end

  it 'raises an error for empty or nil email' do
    expect { EmailVerificationService.check_email('') }.to raise_error(Errors::InvalidEmail, '')
    expect { EmailVerificationService.check_email(nil) }.to raise_error(Errors::InvalidEmail, nil)
  end
end
