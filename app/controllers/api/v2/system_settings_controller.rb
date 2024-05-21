# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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
