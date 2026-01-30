# frozen_string_literal: true

# Copyright (c) 2014 - 2026 UNICEF. All rights reserved.

require 'rails_helper'

describe MailSetupTestMailer, type: :mailer do
  describe '#mail_setup_test' do
    let(:system_settings) { instance_double('SystemSettings', primero_version: '2.0.0') }

    before do
      allow(SystemSettings).to receive(:current).and_return(system_settings)
      allow(ActionMailer::Base).to receive_message_chain(:default_url_options,
                                                         :[]).with(:host).and_return('test.primero.org')
    end

    context 'when only email is provided' do
      let(:mail) { MailSetupTestMailer.mail_setup_test('test@example.com') }

      it 'sends to the email address without name' do
        expect(mail['to'].to_s).to eq('test@example.com')
      end

      it 'renders the subject' do
        expect(mail.subject).to eq('Mailer confirmation: test.primero.org')
      end

      it 'renders the body' do
        expect(mail.body.encoded).to include('Confirming that the Primero action mailer is configured to send emails!')
        expect(mail.body.encoded).to include('Running Primero Server 2.0.0 on test.primero.org.')
      end
    end

    context 'when email and full name are provided' do
      let(:mail) { MailSetupTestMailer.mail_setup_test('test@example.com', 'Test User') }

      it 'sends to the email address with name' do
        expect(mail['to'].to_s).to eq('Test User <test@example.com>')
      end

      it 'renders the subject' do
        expect(mail.subject).to eq('Mailer confirmation: test.primero.org')
      end

      it 'renders the body' do
        expect(mail.body.encoded).to include('Confirming that the Primero action mailer is configured to send emails!')
        expect(mail.body.encoded).to include('Running Primero Server 2.0.0 on test.primero.org.')
      end
    end
  end
end
