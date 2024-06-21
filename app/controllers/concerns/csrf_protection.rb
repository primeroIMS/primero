# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Enables csrf protection.
module CsrfProtection
  extend ActiveSupport::Concern

  included do
    include ActionController::RequestForgeryProtection
    include ActionController::Cookies

    before_action :set_csrf_cookie, unless: -> { request_from_basic_auth? }

    protect_from_forgery with: :exception, prepend: true, if: -> { use_csrf_protection? }
  end

  private

  def set_csrf_cookie
    cookies['CSRF-TOKEN'] = {
      path: '/',
      secure: Rails.env.production?,
      value: form_authenticity_token,
      same_site: :strict
    }
  end

  def use_csrf_protection?
    Rails.configuration.use_csrf_protection && !request_from_basic_auth?
  end

  def request_from_basic_auth?
    request.authorization.present? && request.authorization =~ /^Basic/
  end
end
