module Api::V2
  class LoginController < Devise::RegistrationsController

    def provider
      render :layout => 'identity'
    end

  end
end