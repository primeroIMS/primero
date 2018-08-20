module LoggerActions
  extend ActiveSupport::Concern

  included do
    before_action :log_controller_action, :except => [:new, :active]
  end

  protected

  def logger_record_id
    #TODO - This is a patch because in the router, not all routes are using :id
    #TODO - This can change if the routes ever change to all use :id
    @logger_record_id ||= params[:id] || params[:child_id] || params[:tracing_request_id] || params[:incident_id] || params[:selected_records].try(:split, ',')
  end

  def logger_display_id
    logger_record_id
  end

  def logger_action_identifier
    @logger_action_identifier ||= (action_name == 'create') ? logger_model_titleize : "#{logger_model_titleize} '#{logger_record_id}'"
  end

  def logger_model_titleize
    @logger_model_titleize ||= (model_class.try(:parent_form) || @model_class.try(:parent_form) || model_class.name).titleize.downcase
  end

  def logger_action_titleize
    @logger_action_titleize ||= I18n.t("logger.#{logger_action_name}", :locale => :en)
  end

  def logger_action_name
    action_name
  end

  def by_action_user
    "#{I18n.t("logger.by_user", :locale => :en)} '#{user_name}'"
  end

  def user_name
    @user_name ||= (current_user.present? ? current_user.user_name : "")
  end

  def logger_action_prefix
    logger_action_titleize
  end

  def logger_action_suffix
    by_action_user
  end

  def logger_job_user_name
    params[:user_name] || user_name
  end

  def logger_owned_by
    #override in concern that is appropriate for ownable
  end

  def log_controller_action
    #Format in the index action is used on exports
    #Regular index page has no format parameters.
    #We want to log exports, but not regular index actions
    return 0 if action_name == "index" && params[:format].blank?

    logger.info("#{logger_action_prefix} #{logger_action_identifier} #{logger_action_suffix}")
    AuditLogJob.perform_later(logger_job_user_name, logger_action_name, logger_model_titleize, logger_record_id,
                              logger_display_id, logger_owned_by)
  end

end
