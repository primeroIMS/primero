# frozen_string_literal: true

# API to fetch the active theme
class Api::V2::ThemesController < ApplicationApiController
  before_action :theme

  skip_before_action :authenticate_user!
  skip_after_action :write_audit_log
  
  def index; end

  def manifest; end

  def theme
    @theme = Theme.active
  end
end
