# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Superclass for nearly all Primero CRUD API calls
class ApplicationApiController < ActionController::API
  include CanCan::ControllerAdditions
  include AuditLogActions
  include ErrorHandling
  include CsrfProtection

  # check_authorization #TODO: Uncomment after upgrading to CanCanCan v3

  before_action :authenticate_user!
  before_action :check_config_update_lock!
  before_action :set_csrf_cookie, if: -> { use_csrf_protection? }
  protect_from_forgery with: :exception, if: -> { use_csrf_protection? }

  class << self
    attr_accessor :model_class
  end

  # NOTE: If request unit tests are breaking, make sure to update the list of permitted models in PrimeroModelService
  def model_class
    @model_class ||= PrimeroModelService.to_model(request.path.split('/')[3].singularize)
  end

  def record_id
    return unless params[:id].is_a?(String)

    params[:id]
  end

  def metadata_record_ids
    return [] unless params[:id].present?
    return [params[:id]] if params[:id].is_a?(String)

    params[:id].values
  end

  def authorize_all!(permission, records)
    records.each do |record|
      authorize!(permission, record)
    end
  end

  def check_config_update_lock!
    raise Errors::LockedForConfigurationUpdate if SystemSettings.locked_for_configuration_update?
  end
end
