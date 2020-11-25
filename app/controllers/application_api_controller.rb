# frozen_string_literal: true

# Superclass for nearly all Primero CRUD API calls
class ApplicationApiController < ActionController::API
  include CanCan::ControllerAdditions
  include AuditLogActions

  # check_authorization #TODO: Uncomment after upgrading to CanCanCan v3
  before_action :authenticate_user!
  before_action :check_config_update_lock!

  rescue_from Exception do |exception|
    status, @errors = ErrorService.handle(exception, request)
    @errors.map(&:headers).compact.inject({}, &:merge).each do |name, value|
      response.set_header(name, value)
    end
    render 'api/v2/errors/errors', status: status
  end

  class << self
    attr_accessor :model_class
  end

  def model_class
    @model_class ||= Record.model_from_name(request.path.split('/')[3].singularize)
  end

  def record_id
    params[:id]
  end

  def authorize_all!(permission, records)
    records.each do |record|
      authorize!(permission, record)
    end
  end

  # Devise Magic method, explicitly declared.
  def current_user
    super
  end

  # Devise Magic method, explicitly declared.
  def authenticate_user!
    super
  end

  def check_config_update_lock!
    raise Errors::LockedForConfigurationUpdate if SystemSettings.locked_for_configuration_update?
  end

  # Set default Rails headers on all API calls.
  # TODO: This issue has been addressed in Rails 6, and the method below can be deleted after the upgrade.
  # See:
  #   https://github.com/rails/rails/issues/32483
  #   https://github.com/rails/rails/pull/32484
  def self.make_response!(request)
    ActionDispatch::Response.create.tap do |res|
      res.request = request
    end
  end
end
