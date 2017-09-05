email_settings = YAML::load(File.open("#{Rails.root.to_s}/config/mailers.yml"))[Rails.env.to_s]
Rails.application.config.action_mailer.delivery_method = email_settings[:delivery_method]
Rails.application.config.action_mailer.default_options = email_settings[:default_options] if email_settings[:default_options].present?
ActionMailer::Base.smtp_settings = email_settings[:smtp_conf] if email_settings[:smtp_conf].present?
ActionMailer::Base.default_url_options = { :host => email_settings[:notifications][:host], :protocol => 'https' }