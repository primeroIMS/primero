# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Enables csrf protection.
module CsrfProtection
  extend ActiveSupport::Concern

  included do
    include ActionController::RequestForgeryProtection
    include ActionController::Cookies

    before_action :set_csrf_cookie

    protect_from_forgery with: :exception, prepend: true, if: -> { Rails.configuration.use_csrf_protection }
  end

  private

  def set_csrf_cookie
    cookies['CSRF-TOKEN'] = {
      value: form_authenticity_token,
      domain: :all,
      same_site: :strict
    }
  end
end
