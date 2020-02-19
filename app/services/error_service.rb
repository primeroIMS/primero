# frozen_string_literal: true

# Handles all exceptions for the API controllers so that they can be rendered.
class ErrorService
  def self.handle(error, request)
    case error
    when CanCan::AccessDenied, Errors::ForbiddenOperation
      code = 403
      errors = [ApplicationError.new(code: 403, message: 'Forbidden', resource: request.path)]
    when ActiveRecord::RecordNotFound, Errors::UnknownPrimeroEntityType
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
    when Errors::InvalidPrimeroEntityType
      code = 422
      errors = [ApplicationError.new(code: 422, message: error.message, resource: request.path)]
    when ActiveRecord::RecordInvalid
      code = 422
      errors = error.record.errors.messages.map do |field_name, message|
        ApplicationError.new(
          code: 422,
          message: message,
          resource: request.path,
          detail: field_name.to_s
        )
      end
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
end
