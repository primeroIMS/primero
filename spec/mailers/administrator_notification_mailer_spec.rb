# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

require 'rails_helper'

describe AdministratorNotificationMailer, type: :mailer do
  before do
    clean_data(ContactInformation, SystemSettings)
  end

  let!(:system_admin) { ContactInformation.create(name: 'administrator', email: 'myemail@local.host') }
  let!(:system_settings) do
    SystemSettings.create(
      maximum_attachments_space_warning: 1.megabytes,
      maximum_attachments_space: 2.megabytes
    )
  end
  let(:theme) { double('Theme', system_name: 'MyApp') }

  describe '#notify' do
    context 'when maximum_attachments_space is 0' do
      it 'email is not sent' do
        allow(SystemSettings).to receive(:maximum_attachments_space).and_return(0)

        mail = AdministratorNotificationMailer.notify(:maximum_attachments_space)
        expect(mail.message).to be_a(ActionMailer::Base::NullMail)
        expect(mail.to).to be_nil
      end
    end

    context 'when maximum_attachments_space is positive' do
      it 'build email and to' do
        mail = AdministratorNotificationMailer.notify(:maximum_attachments_space)

        expect(mail.to).to eq(['myemail@local.host'])
        expect(mail.subject).to eq('Reached attachment storage limit for ')
      end
    end
  end
end
