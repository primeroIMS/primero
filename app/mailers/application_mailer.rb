# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Superclass for all Mailers
class ApplicationMailer < ActionMailer::Base
  helper :application

  before_action :load_theme
  before_action :system_admin

  layout 'mailer'

  rescue_from StandardError do |error|
    log_mailer_error(error)
  end

  protected

  def log_mailer_error(error)
    case error
    when ActiveRecord::RecordNotFound
      Rails.logger.error("Attempting to send an email for a record that doesn't exist: #{error.message}")
    when Errors::MailNotConfiguredError
      Rails.logger.debug('Email notification not sent because Primero is not configured to send mail!')
    else
      Rails.logger.error(error.message)
    end
  end

  def load_theme
    @theme = Theme.current
  end

  def system_admin
    @system_admin = ContactInformation.first
  end
end
