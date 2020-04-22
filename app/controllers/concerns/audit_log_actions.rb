# frozen_string_literal: true

# Set the audit log properties
module AuditLogActions
  extend ActiveSupport::Concern

  included do
    after_action :write_audit_log, except: %i[new active]
  end

  private

  def write_audit_log
    audit_log_params = {
      record_type: model_class.name,
      record_id: record_id,
      action: friendly_action_message,
      user_id: current_user.try(:id),
      resource_url: request.url,
      metadata: { user_name: (current_user.try(:user_name) || params[:user].try(:[], :user_name)) }
    }

    AuditLogJob.perform_later(audit_log_params)
  end

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

  def index_action_message
    case request.controller_class.name.demodulize
    when 'TransferRequestsController'
      'list_transfer_requests'
    when 'AlertsController'
      'show_alerts'
    when 'TransfersController'
      'show_transfers'
    when 'ReferralsController'
      'show_referrals'
    else
      request.query_parameters.blank? ? 'list' : action_name
    end
  end

  def create_action_message
    case request.controller_class.name.demodulize
    when 'TokensController'
      'login'
    when 'AssignsController'
      'assign'
    when 'AttachmentsController'
      'attach'
    when 'FlagsController'
      'flag'
    when 'TransferRequestsController'
      'transfer_request'
    when 'TransfersController'
      'transfer'
    when 'ReferralsController'
      'refer'
    else
      action_name
    end
  end

  def update_action_message
    case request.controller_class.name.demodulize
    when 'FlagsController'
      'unflag'
    when 'ApprovalsController'
      "#{approval_params[:approval_type]}_#{approval_params[:approval_status]}"
    when 'TransferRequestsController'
      "transfer_#{params[:data][:status]}"
    when 'TransfersController'
      "transfer_#{params[:data][:status]}"
    when 'ReferralsController'
      "refer_#{params[:data][:status]}"
    else
      action_name
    end
  end

  def destroy_action_message
    case request.controller_class.name.demodulize
    when 'TokensController'
      'logout'
    when 'AssignsController'
      'unassign'
    when 'AttachmentsController'
      'detach'
    when 'ReferralsController'
      'refer_revoke'
    else
      request.query_parameters.blank? ? 'delete' : action_name
    end
  end

  def create_bulk_record_resource
    case request.controller_class.name.demodulize
    when 'FlagsController'
      'bulk_flag'
    when 'AssignsController'
      'bulk_assign'
    when 'TransfersController'
      'bulk_transfer'
    else
      action_name
    end
  end
end
