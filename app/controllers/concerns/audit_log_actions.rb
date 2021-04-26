# frozen_string_literal: true

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

  def write_audit_log
    default_audit_params = {
      record_type: model_class.name,
      record_id: record_id,
      action: friendly_action_message,
      user_id: current_user.try(:id),
      resource_url: request.url,
      metadata: { user_name: guessed_user_name }
    }

    audit_log_params = default_audit_params.merge(audit_params)

    AuditLogJob.perform_later(audit_log_params)
  end

  # Allow controllers to override / add related properties to
  # the audit log.
  def audit_params
    {}
  end

  # rubocop:disable Metrics/CyclomaticComplexity
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
  # rubocop:enable Metrics/CyclomaticComplexity
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
