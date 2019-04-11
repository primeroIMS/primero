duration = Rails.env == 'development' ? 30.days : 1.hour

Rails.application.config.session_store :cookie_store, :expire_after => duration, secure: Rails.env.production?