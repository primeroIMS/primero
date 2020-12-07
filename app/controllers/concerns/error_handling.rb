# frozen_string_literal: true

# Return an error array JSON when errors are raised in the API
module ErrorHandling
  extend ActiveSupport::Concern

  included do
    rescue_from Exception do |exception|
      status, @errors = ErrorService.handle(exception, request)
      @errors.map(&:headers).compact.inject({}, &:merge).each do |name, value|
        response.set_header(name, value)
      end
      render 'api/v2/errors/errors', status: status
    end
  end
end
