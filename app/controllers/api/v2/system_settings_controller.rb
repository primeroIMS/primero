module Api::V2
  class SystemSettingsController < ApplicationApiController
    helper I18nFieldHelper

    def index
      authorize! :index, SystemSettings
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
