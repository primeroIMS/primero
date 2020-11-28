# frozen_string_literal: true

# Custom Devise controller that handles requests for email-based password resets,
# and adapts it to the Primero API scheme
class Api::V2::PasswordResetController < Devise::PasswordsController
  respond_to :json

  include AuditLogActions
  include Api::V2::Concerns::JwtTokens
  include ErrorHandling

  # Submit a request to reset a password over email.
  def password_reset_request
    perform_request(resource_params)
  end

  def user_password_reset_request
    authenticate_user!(force: true)
    user = User.find(params[:user_id])
    authorize! :edit_user, user
    perform_request(email: user.email) if params[:user][:password_reset]
  end

  def perform_request(request_params)
    self.resource = resource_class.send_reset_password_instructions(request_params)
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
    return errors(user) unless user.errors.empty?

    json = { message: 'user.password_reset.success' }
    if warden.user(resource_name) == user
      token_to_cookie
      json = json.merge(id: user.id, user_name: user.user_name, token: current_token)
    end
    render json: json
  end

  def errors(user)
    @errors = user.errors.details.keys.map do |error|
      ApplicationError.new(
        code: 422,
        message: "user.password_reset.errors.#{error}",
        resource: request.path
      )
    end
    render 'api/v2/errors/errors', status: 422
  end

  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end

  # Record type for Audit log
  def model_class
    User
  end

  # Record id for Audit Log
  def record_id; end
end
