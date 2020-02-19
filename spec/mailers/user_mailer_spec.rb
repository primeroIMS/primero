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

  context 'native user' do
    let (:user) do
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
                 'Please contact Admin (admin@test.org) to receive your ' \
                 'user name and password in order to log on to https://localhost:3000/'
      expect(body).to include(fragment)
    end
  end

  context 'IDP user with one time password' do
    let (:user) do
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
      fragment = 'You have been added as a Social Worker. ' \
                 'Please contact Admin (admin@test.org) to receive your user name. ' \
                 'Use the password OTP123 to log on to https://localhost:3000/, and reset when prompted.'
      expect(body).to include(fragment)
    end
  end

  context 'IDP user with single signon' do
    let(:agency) { instance_double('Agency', name: 'UNICEF') }
    let(:user) do
      instance_double(
        'User',
        email: 'user@test.org', agency: agency, user_name: 'user@test.org',
        role: role, locale: 'en', using_idp?: true
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
                 'You may now log on to https://localhost:3000/ with your UNICEF account user@test.org. ' \
                 'Please contact Admin (admin@test.org) for further details.'
      expect(body).to include(fragment)
    end
  end

end