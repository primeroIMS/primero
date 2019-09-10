module Api::V2
  class TokensController < Devise::SessionsController
    include AuditLogActions
    respond_to :json

    skip_before_action :verify_authenticity_token

    # This method overrides the deprecated ActionController::MimeResponds#respond_with
    # that Devise unfortunately still uses. We are overriding it to return a JSON object
    # for the Devise session create method.
    def respond_with(user, _opts={})
      token_to_cookie
      render json: { id: user.id, user_name: user.user_name, token: current_token }
    end

    # Overriding method called by Devise session destroy.
    def respond_to_on_destroy
      cookies.delete(:primero_token, domain: primero_host)
      render json: {}
    end

    def current_token
      request.env['warden-jwt_auth.token']
    end

    def token_to_cookie
      cookies[:primero_token] = {
        value: current_token,
        domain: primero_host,
        expires: 1.hour,
        httponly: true,
        secure: (Rails.env == 'production')
      }
    end

    def model_class
      User
    end

    def record_id
      current_user.try(:id)
    end

    private

    def primero_host
      Rails.application.routes.default_url_options[:host]
    end

  end

end
