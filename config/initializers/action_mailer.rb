# frozen_string_literal: true

email_settings = ConfigYamlLoader.load(Rails.root.join('config', 'mailers.yml'))

Rails.application.config.action_mailer.tap do |action_mailer|
  action_mailer.delivery_method = email_settings[:delivery_method].to_sym
  email_settings[:default_options].present? &&
    (action_mailer.default_options = email_settings[:default_options])
  action_mailer.smtp_settings = email_settings[:smtp_conf]
  action_mailer.raise_delivery_errors = true
  action_mailer.perform_deliveries = true
end

ActionMailer::Base.default_url_options = {
  host: email_settings[:notifications][:host],
  protocol: 'https'
}
