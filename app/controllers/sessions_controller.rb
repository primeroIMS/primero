  class SessionsController < Devise::SessionsController
    include LoggerActions

    def active
      render plain: 'OK'
    end

    # Override methods in LoggerActions.
    def logger_action_name
      if action_name == 'create'
        'login'
      elsif action_name == 'destroy'
        'logout'
      else
        super
      end
    end

    def logger_action_identifier
      nil
    end

    def logger_model_titleize
      nil
    end

    def by_action_user
      if action_name == 'create'
        params[:user_name].present? ? "#{I18n.t("logger.by_user", :locale => :en)} '#{params[:user_name]}'" : ''
      else
        super
      end
    end
  end
