# frozen_string_literal: true

namespace :mailer do
  desc 'Verify Primero email configuration by sending email to specified address.'
  task :verify, [:email] => :environment do |_, args|
    to_email = args[:email]
    MailSetupTestMailer.mail_setup_test(to_email).deliver_now
  end
end
