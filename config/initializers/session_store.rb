duration = Rails.env == 'development' ? 30.days : 20.minutes

Rails.application.config.session_store :cookie_store, :expire_after => duration