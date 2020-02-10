# frozen_string_literal: true

# Thrown when something looks weird with our encryption service
class Errors::MisconfiguredEncryptionError < StandardError; end