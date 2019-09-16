module Api::V2
  class ContactInformationController < ApplicationApiController
    skip_before_action :authenticate_user!, only: [:index]

    def index
      @contact_information = ContactInformation.current
      @system_settings = SystemSettings.current
    end
  end
end