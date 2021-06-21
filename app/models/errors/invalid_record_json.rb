# frozen_string_literal: true

# Raised when the JSON POST/PATCH request on a record does not conform to the dynmically generates JSON schema
class Errors::InvalidRecordJson < StandardError
  attr_accessor :invalid_props
end
