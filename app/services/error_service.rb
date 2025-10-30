# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Handles all exceptions for the API controllers so that they can be rendered.
class ErrorService
  # We have a simple switch statement to instantiate the various errors thrown by Primero
  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/MethodLength
  def self.handle(error, request)
    case error
    when CanCan::AccessDenied, Errors::ForbiddenOperation
      code = 403
      errors = [ApplicationError.new(code: 403, message: 'Forbidden', resource: request.path)]
    when ActiveRecord::RecordNotFound, Errors::UnknownPrimeroEntityType, ActionController::RoutingError,
      Errors::WebpushNotEnabled
      code = 404
      errors = [ApplicationError.new(code: 404, message: 'Not Found', resource: request.path, detail: error&.message)]
    when ActiveRecord::RecordNotUnique
      code = 409
      errors = [
        ApplicationError.new(
          code: 409,
          message: 'Conflict: A record with this id already exists',
          resource: request.path
        )
      ]
    when Errors::InvalidPrimeroEntityType, ActionController::ParameterMissing
      code = 422
      errors = [ApplicationError.new(code: 422, message: error.message, resource: request.path)]
    when Errors::InvalidRecordJson
      code = 422
      errors = [
        ApplicationError.new(code: 422, message: error.message, resource: request.path, detail: error.invalid_props)
      ]
    when ActiveRecord::RecordInvalid
      code = 422
      errors = error.record.errors.messages.map do |field_name, message|
        ApplicationError.new(
          code: 422,
          message:,
          resource: request.path,
          detail: field_name.to_s
        )
      end
    when Errors::LockedForConfigurationUpdate
      code = 503
      errors = [
        ApplicationError.new(
          code: 503, message: 'Service Unavailable', resource: request.path,
          detail: "Retry-After: #{error&.retry_after}",
          headers: { 'Retry-After' => error&.retry_after&.to_s }
        )
      ]
    when JWT::DecodeError, JWT::IncorrectAlgorithm, JWT::InvalidAudError, JWT::ExpiredSignature, JWT::InvalidIatError,
      JWT::InvalidIssuerError, JWT::InvalidJtiError, JWT::ImmatureSignature, JWT::InvalidSubError
      code = 401
      errors = [ApplicationError.new(code:, message: error.message, resource: request.path)]
    when Errors::BulkAssignRecordsSizeError, ActionController::InvalidAuthenticityToken
      code = 403
      errors = [ApplicationError.new(code:, message: error.message, resource: request.path)]
    when Errors::InvalidCaptcha
      code = 422
      errors = [ApplicationError.new(code: 422, message: 'errors.api.user.invalid_captcha', resource: request.path)]
    when Errors::CaptchaServiceUnavailable
      code = 503
      errors = [ApplicationError.new(code: 503, message: 'errors.api.user.captcha_service_unavailable',
                                     resource: request.path)]
    when Errors::InvalidEmail
      code = 422
      errors = [ApplicationError.new(code: 422, message: 'errors.api.user.disposable_email', resource: request.path)]
    else
      code = 500
      errors = [
        ApplicationError.new(
          code: 500,
          message: error.message,
          resource: request.path
        )
      ]
      Rails.logger.error error.backtrace.join("\n\t")
    end
    [code, errors]
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/MethodLength
end
