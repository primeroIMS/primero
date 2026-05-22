# frozen_string_literal: true

# Handles all exceptions for the API controllers so that they can be rendered.
class ErrorService
  # We have a simple switch statement to instantiate the various errors thrown by Primero
  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/MethodLength
  def self.handle(error, request)
    case error
    when JWT::DecodeError, JWT::IncorrectAlgorithm, JWT::InvalidAudError, JWT::ExpiredSignature, JWT::InvalidIatError,
      JWT::InvalidIssuerError, JWT::InvalidJtiError, JWT::ImmatureSignature, JWT::InvalidSubError
      code = 401
      errors = [ApplicationError.new(code:, message: error.message, resource: request.path)]
    when CanCan::AccessDenied, Errors::ForbiddenOperation
      code = 403
      errors = [ApplicationError.new(code:, message: 'Forbidden', resource: request.path)]
    when ActionController::InvalidAuthenticityToken
      code = 403
      errors = [ApplicationError.new(code:, message: error.message, resource: request.path)]
    when ActiveRecord::RecordNotFound, Errors::UnknownPrimeroEntityType, ActionController::RoutingError,
      Errors::AttachmentNotFound, Errors::WebpushNotEnabled
      code = 404
      errors = [ApplicationError.new(code:, message: 'Not Found', resource: request.path, detail: error&.message)]
    when ActiveRecord::RecordNotUnique
      code = 409
      errors = [
        ApplicationError.new(
          code:,
          message: 'Conflict: A record with this id already exists',
          resource: request.path
        )
      ]
    when Errors::InvalidPrimeroEntityType, ActionController::ParameterMissing,
      Errors::BulkAssignRecordsSizeError, Errors::BulkFlagRecordsSizeError
      code = 422
      errors = [ApplicationError.new(code:, message: error.message, resource: request.path)]
    when Errors::InvalidRecordJson
      code = 422
      errors = [
        ApplicationError.new(code: 422, message: error.message, resource: request.path, detail: error.invalid_props)
      ]
    when ActiveRecord::RecordInvalid
      code = 422
      errors = error.record.errors.messages.map do |field_name, message|
        ApplicationError.new(code:, message:, resource: request.path, detail: field_name.to_s)
      end
    when Errors::InvalidCaptcha
      code = 422
      errors = [ApplicationError.new(code:, message: 'errors.api.user.invalid_captcha', resource: request.path)]
    when Errors::InvalidEmail
      code = 422
      errors = [ApplicationError.new(code:, message: 'errors.api.user.disposable_email', resource: request.path)]
    when Errors::LockedForConfigurationUpdate
      code = 503
      errors = [
        ApplicationError.new(
          code:, message: 'Service Unavailable', resource: request.path,
          detail: "Retry-After: #{error&.retry_after}",
          headers: { 'Retry-After' => error&.retry_after&.to_s }
        )
      ]
    when Errors::CaptchaServiceUnavailable
      code = 503
      errors = [ApplicationError.new(code:, message: 'errors.api.user.captcha_service_unavailable',
                                     resource: request.path)]
    else
      code = 500
      errors = [ApplicationError.new(code:,message: error.message,resource: request.path)]
      Rails.logger.error error.backtrace.join("\n\t")
    end
    [code, errors]
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/MethodLength
end
