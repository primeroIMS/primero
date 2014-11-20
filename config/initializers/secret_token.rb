session_secret = Security::SessionSecret.session_secret
if session_secret.present?
  Rails.application.config.secret_token = session_secret["token"]
  Rails.application.config.secret_key_base = session_secret["key_base"]
else
  Rails.logger.error 'Session secret not loaded!'
end
