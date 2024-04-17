# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Superclass for all non-API controllers
class ApplicationController < ActionController::Base
  before_action :set_csrf_cookie

  protect_from_forgery with: :exception

  def set_csrf_cookie
    cookies['CSRF-TOKEN'] = {
      value: form_authenticity_token,
      domain: :all,
      same_site: :strict
    }
  end
end
