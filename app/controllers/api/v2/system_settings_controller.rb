module Api::V2
  class SystemSettingsController < ApplicationApiController
    skip_before_action :authenticate_user!, only: [:index]

    def index
      @system_setting = SystemSettings.first
      if params[:extended] == 'true'
        @primero_modules = PrimeroModule.all
        @agencies = Agency.all
      end
    end

    def model_class
      SystemSettings
    end

  end
end
