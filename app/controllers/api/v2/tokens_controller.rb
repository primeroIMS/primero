module Api::V2
  class TokensController < Devise::SessionsController
    respond_to :json

    skip_before_action :verify_authenticity_token

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