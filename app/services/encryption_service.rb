# frozen_string_literal: true

# Symmetrically encrypt and decrypt values via libsodium,
# using a single key known to the entire application.
# WARNING: THINK LONG AND HARD BEFORE RELYING ON THIS!!!!!
class EncryptionService
  include Singleton

  class << self
    def instance
      @instance ||= new
    rescue StandardError
      raise Errors::MisconfiguredEncryptionError
    end

    def encrypt(value)
      instance.encrypt(value)
    end

    def decrypt(encrypted_value)
      instance.decrypt(encrypted_value)
    end
  end

  def initialize
    key = ENV.fetch('PRIMERO_MESSAGE_SECRET').b
    @secret_box = RbNaCl::SimpleBox.from_secret_key(key)
  end

  def encrypt(value)
    Base64.encode64(@secret_box.encrypt(value))
  end

  def decrypt(encrypted_value)
    @secret_box.decrypt(Base64.decode64(encrypted_value))
  end
end