# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Set the audit log properties
module AuditLogActions
  extend ActiveSupport::Concern

  included do
    after_action :write_audit_log, except: %i[new active]
  end

  private

  def guessed_user_name
    current_user.try(:user_name) || params[:user].try(:[], :user_name) || params[:user].try(:[], :email)
  end

  def default_metadata_audit_params
    {
      user_name: guessed_user_name,
      remote_ip: LogUtils.remote_ip(request),
      agency_id: current_user.try(:agency_id),
      role_id: current_user.try(:role_id),
      http_method: request.method,
      record_ids: metadata_record_ids
    }
  end

  def default_audit_params
    {
      record_type: model_class.name,
      record_id:,
      action: friendly_action_message,
      user_id: current_user.try(:id),
      resource_url: request.url,
      metadata: default_metadata_audit_params
    }
  end

  def write_audit_log
    AuditLogJob.perform_later(**default_audit_params.merge(audit_params))
  end

  # Allow controllers to override / add related properties to
  # the audit log.
  def audit_params
    {}
  end

  # rubocop:disable Metrics/MethodLength
  def friendly_action_message
    return params[:record_action] if params[:record_action].present?

    case action_name
    when 'index'
      index_action_message
    when 'create'
      create_action_message
    when 'update'
      update_action_message
    when 'destroy'
      destroy_action_message
    when 'create_bulk', 'bulk_create'
      create_bulk_record_resource
    else
      action_name
    end
  end
  # rubocop:enable Metrics/MethodLength

  def index_action_message
    request.query_parameters.blank? ? 'list' : action_name
  end

  def create_action_message
    action_name
  end

  def update_action_message
    action_name
  end

  def destroy_action_message
    request.query_parameters.blank? ? 'delete' : action_name
  end

  def create_bulk_record_resource
    action_name
  end
end
