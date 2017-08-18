#TODO: plug in actual mail address/domain values

email_settings = YAML::load(File.open("#{Rails.root.to_s}/config/mailers.yml"))
#puts "The email env is ==> #{email_settings[Rails.env]["smtp_conf"]}"
#puts "The email notificatins env is ==> #{email_settings[Rails.env]["notifications"]}"
#puts "The host is ==> #{email_settings[Rails.env]["notifications"][:host]}"
ActionMailer::Base.smtp_settings = email_settings[Rails.env]["smtp_conf"] unless email_settings[Rails.env].nil?
#ActionMailer::Base.default_url_options = email_settings[Rails.env]["notifications"] unless email_settings[Rails.env].nil?
ActionMailer::Base.default_url_options = { :host => email_settings[Rails.env]["notifications"]["host"], :protocol => 'https' }
ENV['mailer.from.address'] = 'test-noreply@mail.example.com'
#ENV['mailer.reply_to.address'] = 'test-noreply@mail.example.com'