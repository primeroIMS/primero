# frozen_string_literal: true

# Superclass for all the business reasons a Primero mailer refuses to work
class Errors::MailNotConfiguredError < StandardError; end