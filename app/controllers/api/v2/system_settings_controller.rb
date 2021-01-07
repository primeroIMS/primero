# frozen_string_literal: true

# API to fetch the settings driving Primero
class Api::V2::SystemSettingsController < ApplicationApiController
  def index
    @system_setting = SystemSettings.first
    @primero_modules = extended? ? PrimeroModule.all : []
    @agencies = extended? ? Agency.all : []
  end

  def model_class
    SystemSettings
  end

  def extended?
    params[:extended] == 'true'
  end
end
