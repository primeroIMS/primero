# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# API to fetch the settings driving Primero
class Api::V2::SystemSettingsController < ApplicationApiController
  def index
    @system_setting = SystemSettings.first
    @primero_modules = extended? ? PrimeroModule.all : []
    @agencies = extended? ? extended_agencies : []
  end

  def model_class
    SystemSettings
  end

  def extended?
    params[:extended] == 'true'
  end

  def extended_agencies
    Agency.includes(logo_full_attachment: :blob, logo_icon_attachment: :blob, terms_of_use_attachment: :blob).all
  end
end
