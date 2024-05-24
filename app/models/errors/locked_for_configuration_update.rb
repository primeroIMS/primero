# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Error thrown while accessing the API if the Primero configuration is in an unknown state
class Errors::LockedForConfigurationUpdate < StandardError
  def retry_after
    60
  end
end
