# frozen_string_literal: true

# API to fetch the active theme
class ThemesController < ApplicationController
  skip_before_action :verify_authenticity_token

  before_action :theme

  def index; end

  def manifest; end

  def theme
    @theme = Rails.configuration.use_theme ? Theme.current : Theme.default
  end
end
