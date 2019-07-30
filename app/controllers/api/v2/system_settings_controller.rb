module Api::V2
  class SystemSettingsController < ApplicationApiController

    def index
      authorize! :index, SystemSettings
      @system_setting = SystemSettings.first
      @primero_modules = PrimeroModule.all
      @agencies = Agency.all
    end

  end
end
