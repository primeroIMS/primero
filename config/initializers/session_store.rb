duration = Rails.env == 'development' ? 30.days : 2.hours

Rails.application.config.session_store :cookie_store, :expire_after => duration, secure: Rails.env.production?