require 'rails_helper'

describe IdentitySyncService do

  before(:each) do
    clean_data(User, Role, Agency)
  end

  let(:user) do
    role = Role.new(name: 'Test role')
    role.save(validate: false)
    agency = Agency.create(name: 'Age', unique_id: 'age', agency_code: 'AGE')
    User.new(
      user_name: 'testuser@testdomain.org', full_name: 'Test User',
      role: role, agency: agency, email: 'testuser@testdomain.org',
      password: 'Abcde12345!', password_confirmation: 'Abcde12345!'
    )
  end

  let(:connector) do
    double(
      'connector',
      sync: {
        one_time_password: 'OTP123',
        identity_provider_sync: {
          aad: {
            perform_sync: false,
            synced_on: DateTime.now,
            message: '(ABC123) '
          }
        }
      }
    )
  end

  let(:service) do
    s = IdentitySyncService.new
    (s.connectors = [connector]) && s
  end

  describe '.sync!' do
    it 'saves sync data returned by the connectors to the User' do
      result = service.sync!(user)
      expect(user.identity_provider_sync['aad']['synced_on']).to be
      expect(user.identity_provider_sync['aad']['perform_sync']).to eq(false)
      expect(result[:one_time_password]).to eq('OTP123')
    end
  end

  describe '.sanitize' do
    it 'only accepts valid attributes on the User' do
      result = service.sanitize(identity_provider_sync: {}, one_time_password: 'bar')
      expect(result[:one_time_password]).to be_nil
      expect(result[:identity_provider_sync]).to be
    end
  end

  after(:each) do
    clean_data(User, Role, Agency)
  end



end