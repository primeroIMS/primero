# frozen_string_literal: true

# Superclass for nearly all Primero CRUD API calls
class ApplicationApiController < ActionController::API
  include CanCan::ControllerAdditions
  include AuditLogActions

  # check_authorization #TODO: Uncomment after upgrading to CanCanCan v3
  before_action :authenticate_user!

  rescue_from Exception do |exception|
    status, @errors = ErrorService.handle(exception, request)
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
end