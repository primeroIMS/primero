# frozen_string_literal: true

require 'rails_helper'

describe UserMailer, type: :mailer do
  before do
    system_settings = instance_double(
      'SystemSettings', notification_email_enabled: true, system_name: 'Test CPIMS+'
    )
    allow(SystemSettings).to receive(:current).and_return(system_settings)
    allow(User).to receive(:find).with(1).and_return(user)
    allow(User).to receive(:find).with(2).and_return(admin)
  end

  let(:admin) { instance_double('User', email: 'admin@test.org', full_name: 'Admin') }
  let(:role) { instance_double('Role', name: 'Social Worker') }
  let(:identity_provider) { instance_double('IdentityProvider', name: 'Test') }

  context 'native user' do
    let(:user) do
      instance_double(
        'User',
        email: 'user@test.org',
        role: role, locale: 'en', using_idp?: false
      )
    end
    let(:mail) { UserMailer.welcome(1, 2) }

    it 'renders the subject' do
      expect(mail.subject).to eq('Welcome to Test CPIMS+!')
    end

    it 'renders the body' do
      body = mail.body.encoded
      expect(body).to include('Welcome to Test CPIMS+!')
      fragment = 'You have been added as a Social Worker. ' \
                 'Please contact Admin (admin@test.org) for follow up instructions ' \
                 'to get started working with https://localhost:3000/'
      expect(body).to include(fragment)
    end
  end

  context 'IDP user with one time password' do
    let(:user) do
      instance_double(
        'User',
        email: 'user@test.org',
        role: role, locale: 'en', using_idp?: true
      )
    end
    let(:mail) { UserMailer.welcome(1, 2, 'OTP123') }

    it 'renders the subject' do
      expect(mail.subject).to eq('Welcome to Test CPIMS+!')
    end

    it 'renders the body' do
      body = mail.body.encoded
      expect(body).to include('Welcome to Test CPIMS+!')
      expected = {
        header: 'You have been added as a Social Worker.',
        step1: 'Please contact Admin (admin@test.org) to receive your user name.',
        step2: 'Go to https://localhost:3000/ and click "login with Primero user name.".',
        step3: 'Login with your user name and the temporary password OTP123.',
        step4: 'When prompted, reset your password.'
      }

      expect(body).to include(expected[:header])
      expect(body).to include(expected[:step1])
      expect(body).to include(expected[:step2])
      expect(body).to include(expected[:step3])
      expect(body).to include(expected[:step4])
    end
  end

  context 'IDP user with single signon' do
    let(:agency) { instance_double('Agency', name: 'UNICEF') }
    let(:user) do
      instance_double(
        'User',
        email: 'user@test.org', agency: agency, user_name: 'user@test.org',
        role: role, locale: 'en', using_idp?: true, identity_provider: identity_provider
      )
    end
    let(:mail) { UserMailer.welcome(1, 2) }

    it 'renders the subject' do
      expect(mail.subject).to eq('Welcome to Test CPIMS+!')
    end

    it 'renders the body' do
      body = mail.body.encoded
      expect(body).to include('Welcome to Test CPIMS+!')
      expected = {
        header: 'You have been added as a Social Worker.',
        step1: 'Go to https://localhost:3000/ and click Test.',
        step2: 'Login with your Test account user@test.org.',
        step3: 'Use the same password you always use for your Test account.',
        footer: 'Please contact Admin (admin@test.org) for further details.'
      }

      expect(body).to include(expected[:header])
      expect(body).to include(expected[:step1])
      expect(body).to include(expected[:step2])
      expect(body).to include(expected[:step3])
      expect(body).to include(expected[:footer])
    end
  end
end
