class ApplicationApiController < ActionController::API
  include CanCan::ControllerAdditions

  #check_authorization #TODO: Uncomment after upgrading to CanCanCan v3
  before_action :authenticate_user!

  #TODO: DRY this into an ErrorService
  rescue_from CanCan::AccessDenied do |exception|
    @errors = [
        ApplicationError.new(code: 403, message: 'Forbidden', resource: request.path, exception: exception)
    ]
    render 'api/v2/errors/errors', status: 403
  end

  rescue_from ActiveRecord::RecordNotFound do |exception|
    @errors =  [
        ApplicationError.new(code: 404, message: 'Not Found', resource: request.path, exception: exception)
    ]
    render 'api/v2/errors/errors', status: 404
  end

  class << self
    attr_accessor :model_class
  end

  def model_class
    self.class.model_class
  end

end