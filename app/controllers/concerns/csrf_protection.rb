# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Enables csrf protection.
module CsrfProtection
  extend ActiveSupport::Concern

  included do
    include ActionController::RequestForgeryProtection
    include ActionController::Cookies
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
    Rails.configuration.use_csrf_protection &&
      !request_from_basic_auth? &&
      !Rails.configuration.x.idp.use_identity_provider
  end

  def request_from_basic_auth?
    warden&.winning_strategy.try(:authentication_type) == :http_auth
  end
end
