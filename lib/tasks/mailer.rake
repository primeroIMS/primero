namespace :mailer do
  desc "Verify Primero email configuration by sending email to specified address."
  task :verify, [:email] => :environment do |t, args|
    to_email = args[:email]
    mail = MailSetupTestMailer.mail_setup_test(to_email).deliver
  end
end