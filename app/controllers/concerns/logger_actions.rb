module LoggerActions
  extend ActiveSupport::Concern

  included do
    before_filter :log_controller_action, :except => [:new, :create, :index, :reindex]
  end

  protected

  def logger_action_identifier
    params[:id]
  end

  def logger_model_titleize
    (model_class.try(:parent_form) || @model_class.try(:parent_form) || model_class.name).titleize.downcase
  end

  def logger_action_titleize
    I18n.t("logger.#{action_name}", :locale => :en, :default => action_name.titleize)
  end

  def by_action_user
    "#{I18n.t("logger.by_user", :locale => :en)} '#{current_user.user_name}'"
  end

  def logger_action_prefix
    "#{logger_action_titleize} #{logger_model_titleize}"
  end

  def logger_action_suffix
    by_action_user
  end

  def log_controller_action
    #Some actions operate over one record or more than one record, can exclude in the same way
    #as :index action. workaround is expecting the id parameter to log information.
    #dunno if some actions use a different parameter as id.
    #TODO right?
    if params[:id].present?
      logger.info("#{logger_action_prefix} '#{logger_action_identifier}' #{logger_action_suffix}")
    end
  end

end
