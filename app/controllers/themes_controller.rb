# frozen_string_literal: true

# API to fetch the active theme
class ThemesController < ApplicationController
  before_action :theme

  skip_before_action :verify_authenticity_token

  def index; end

  def manifest; end

  def theme
    @theme = Rails.configuration.x.use_theme ? Theme.current : Theme.default
  end
end
