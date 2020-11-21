# frozen_string_literal: true

# Custom Devise controller that handles requests for email-based password resets,
# and adapts it to the Primero API scheme
class Api::V2::PasswordResetController < Devise::PasswordsController
  # TODO: Audit access attempts?
  # include AuditLogActions
  include Api::V2::Concerns::JwtTokens
  respond_to :json

  # Submit a request to reset a password over email.
  def password_reset_request
    self.resource = resource_class.send_reset_password_instructions(resource_params)
    render json: { data: { message: 'user.password_reset.request_submitted' } }
  end

  # Reset a password given a token
  def password_reset
    # Delegate to the Devise::PasswordsController password reset logic
    update
  end

  # This method overrides the deprecated ActionController::MimeResponds#respond_with
  # that Devise unfortunately still uses. We are overriding it to return a JSON object
  # for the Devise password reset.
  def respond_with(user, _opts = {})
    return errors unless user.errors.empty?

    token_to_cookie if warden.user(resource_name) == resource
    render json: { data: { message: 'user.password_reset.success' } }
  end

  def errors(user)
    @errors = user.errors.details.keys.map do |error|
      ApplicationError.new(
        code: 422,
        message: "user.password_reset.#{error}",
        resource: request.path
      )
    end
    render 'api/v2/errors/errors', status: 422
  end

  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end

  def model_class
    User
  end
end
