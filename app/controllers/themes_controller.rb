# frozen_string_literal: true

# API to fetch the active theme
class ThemesController < ApplicationController
  # NOTE: Primero front-end dynamically loads /themes.js using es6 dynamic imports. Rails is throwing
  # ActionController::InvalidCrossOriginRequest error if we do not skip verify_same_origin_request
  skip_after_action :verify_same_origin_request, unless: -> { request_not_from_app_host? }

  before_action :theme

  def index; end

  def manifest; end

  def theme
    @theme = Theme.current
  end

  def request_not_from_app_host?
    request.host != Rails.application.routes.default_url_options[:host]
  end
end
