# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Raised when the JSON POST/PATCH request on a record does not conform to the dynmically generates JSON schema
class Errors::InvalidRecordJson < StandardError
  attr_accessor :invalid_props
end
