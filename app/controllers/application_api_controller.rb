class ApplicationApiController < ActionController::API
  include CanCan::ControllerAdditions

  #check_authorization #TODO: Uncomment after upgrading to CanCanCan v3
  before_action :authenticate_user!

  rescue_from CanCan::AccessDenied do |exception|
    @errors = [
        ApplicationError.new(code: 403, message: 'Forbidden', resource: request.path, exception: exception)
    ]
    render 'api/v2/errors/errors', :status => 403
  end

  class << self
    attr_accessor :model_class
  end

  def model_class
    self.class.model_class
  end

end