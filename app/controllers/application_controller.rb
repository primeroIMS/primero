# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Superclass for all non-API controllers
class ApplicationController < ActionController::Base
  include CsrfProtection
end
