# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Wrapper for an API/application error returned by Primero
class ApplicationError < ValueObject
  attr_accessor :code, :message, :resource, :detail, :headers
end
