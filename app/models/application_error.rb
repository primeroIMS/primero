# frozen_string_literal: true

# Wrapper for an API/application error returned by Primero
class ApplicationError < ValueObject
  attr_accessor :code, :message, :resource, :detail, :headers
end
