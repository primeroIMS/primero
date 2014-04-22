session_secret = Security::SessionSecret.session_secret
Rails.application.config.secret_token = session_secret["token"]
Rails.application.config.secret_key_base = session_secret["key_base"]
