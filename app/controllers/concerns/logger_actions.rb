module LoggerActions
  extend ActiveSupport::Concern

  included do
    before_action :log_controller_action, :except => [:new, :active]
  end

  protected

  def logger_action_identifier
    (action_name == 'create') ? logger_model_titleize : "#{logger_model_titleize} '#{params[:id]}'"
  end

  def logger_model_titleize
    (model_class.try(:parent_form) || @model_class.try(:parent_form) || model_class.name).titleize.downcase
  end

  def logger_action_titleize
    I18n.t("logger.#{action_name}", :locale => :en)
  end

  def by_action_user
    user_name = (current_user.present? ? current_user.user_name : "")
    "#{I18n.t("logger.by_user", :locale => :en)} '#{user_name}'"
  end

  def logger_action_prefix
    logger_action_titleize
  end

  def logger_action_suffix
    by_action_user
  end

  def log_controller_action
    #Format in the index action is used on exports
    #Regular index page has no format parameters.
    #We want to log exports, but not regular index actions
    return 0 if action_name == "index" && params[:format].blank?

    logger.info("#{logger_action_prefix} #{logger_action_identifier} #{logger_action_suffix}")
  end

end
