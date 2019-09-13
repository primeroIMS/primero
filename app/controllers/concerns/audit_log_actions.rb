module AuditLogActions
  extend ActiveSupport::Concern

  included do
    after_action :write_audit_log, except: [:new, :active]
  end

  private

  def write_audit_log
    audit_log_params = {
      record_type: model_class.name,
      record_id: record_id,
      action: action_name,
      user_id: current_user.try(:id),
      resource_url: request.url,
      metadata: {user_name: (current_user.try(:user_name) || params[:user].try(:[], :user_name))}
    }

    AuditLogJob.perform_later(audit_log_params)
  end

end
