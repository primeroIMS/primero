# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Superclass for all non-API controllers
class ApplicationController < ActionController::Base
  include CsrfProtection

  before_action :set_csrf_cookie, if: -> { use_csrf_protection? }
  protect_from_forgery with: :exception, if: -> { use_csrf_protection? }
end
