# frozen_string_literal: true

# API to fetch the active theme
class ThemesController < ApplicationController
  skip_after_action :verify_same_origin_request, unless: -> { Rails.env.production? }

  before_action :theme

  def index; end

  def manifest; end

  def theme
    @theme = Rails.configuration.use_theme ? Theme.current : Theme.default
  end
end
