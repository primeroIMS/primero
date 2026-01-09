# frozen_string_literal: true

namespace :mailer do
  desc 'Verify Primero email configuration by sending email to specified address.'
  task :verify, [:email, :full_name] => :environment do |_, args|
    to_email = args[:email]
    full_name = args[:full_name]
    MailSetupTestMailer.mail_setup_test(to_email, full_name).deliver_now
  end
end
