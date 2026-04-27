# frozen_string_literal: true

# Error thrown while accessing the API if the Primero configuration is in an unknown state
class Errors::LockedForConfigurationUpdate < StandardError
  def retry_after
    60
  end
end
