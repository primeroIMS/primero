module Api::V2
  class TokensController < Devise::SessionsController
    respond_to :json

    #TODO: This is temporary while we are retaining v1.x code in the ApplicationController
    #      Remove when we have finished ripping out v1.x controllers and views
    skip_before_action :authenticate_user!
    skip_before_action :permit_all_params
    skip_before_action :load_system_settings
    skip_before_action :set_locale

    # This method overrides the deprecated ActionController::MimeResponds#respond_with
    # that Devise unfortunately still uses. We are overriding it to return a JSON object
    # for the Devise session create method.
    def respond_with(user, _opts={})
      render json: { user_name: user.user_name, token: current_token }

    end

    # Overriding method called by Devise session destroy.
    def respond_to_on_destroy
      render json: {}
    end

    def current_token
      request.env['warden-jwt_auth.token']
    end

    def resource_name
      :user
    end

  end
end