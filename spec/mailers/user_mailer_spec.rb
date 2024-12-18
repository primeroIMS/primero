# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe UserMailer, type: :mailer do
  before do
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
        full_name: 'James Joy',
        role:, locale: 'en', using_idp?: false
      )
    end
    let(:mail) { UserMailer.welcome(1, 1) }

    it 'renders the subject' do
      expect(mail.subject).to eq('Primero Login Instructions')
    end

    it 'renders the body' do
      body = mail.body.encoded
      fragment = 'Once logged in please go to your user profile to find your username. ' \
                 'You will find your user profile in the left navigation of Primero'
      expect(body).to include(fragment)
      expect(body).to include('We are creating a Social Worker account for you')
    end
  end

  context 'IDP user with one time password' do
    let(:user) do
      instance_double(
        'User',
        email: 'user@test.org',
        full_name: 'James Joy',
        role:, locale: 'en', using_idp?: true
      )
    end
    let(:mail) { UserMailer.welcome(1, 'OTP123') }

    it 'renders the subject' do
      expect(mail.subject).to eq('Welcome to Primero!')
    end

    it 'renders the body' do
      body = mail.body.encoded
      expect(body).to include('Welcome to Primero!')
      expected = {
        header: 'You have been added as a Social Worker.',
        step1: 'Once logged in please go to your user profile to find your username',
        step2: 'Use the following to reset your password to <b>OTP123</b>',
        otp: 'OTP123'
      }

      expect(body).to include(expected[:header])
      expect(body).to include(expected[:step1])
      expect(body).to include(expected[:step2])
    end
  end

  context 'IDP user with single signon' do
    let(:agency) { instance_double('Agency', name: 'UNICEF') }
    let(:user) do
      instance_double(
        'User',
        full_name: 'James Joy',
        email: 'user@test.org', agency:, user_name: 'user@test.org',
        role:, locale: 'en', using_idp?: true, identity_provider:
      )
    end
    let(:mail) { UserMailer.welcome(1, 2) }

    it 'renders the subject' do
      expect(mail.subject).to eq('Welcome to Primero!')
    end

    it 'renders the body' do
      body = mail.body.encoded
      expected = {
        header: 'You have been added as a Social Worker.',
        step1: 'Once logged in please go to your user profile to find your username. You will find your user profile ' \
               'in the left navigation of Primero.',
        step2: 'Use the following to reset your password to <b>2</b>'
      }

      expect(body).to include(expected[:header])
      expect(body).to include(expected[:step1])
      expect(body).to include(expected[:step2])
    end
  end
end
