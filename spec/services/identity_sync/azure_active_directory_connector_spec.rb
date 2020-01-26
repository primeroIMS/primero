require 'rails_helper'

describe IdentitySync::AzureActiveDirectoryConnector do

  let(:idp) do
    i = IdentityProvider.new
    (i.configuration = { identity_sync_connector: 'AzureActiveDirectoryConnector' }) && i
  end
  let(:user) { User.new(user_name: 'testuser@test.org', full_name: 'Test user', identity_provider: idp) }
  let(:connection) { double('connection') }
  let(:connector) do
    c = IdentitySync::AzureActiveDirectoryConnector.new
    (c.connection = connection) && c
  end

  describe '.create' do
    it 'executes and returns a valid user creation response' do
      expect(connection).to(
        receive(:post).with('/users', user_name: 'testuser@test.org', full_name: 'Test user', enabled: true)
                      .and_return([200, { 'one_time_password' => 'OTP123', 'correlation_id' => 'CORR123' }])
      )
      response = connector.create(user)
      expect(response[:one_time_password]).to eq('OTP123')
      expect(response[:identity_provider_sync][:aad][:perform_sync]).to be_falsey
      expect(response[:identity_provider_sync][:aad][:message]).to include('CORR123')
    end
  end

  describe '.update' do
    it 'executes and returns a valid user update response' do
      expect(connection).to(
        receive(:patch).with('/users/testuser@test.org', user_name: 'testuser@test.org', full_name: 'Test user NEW', enabled: true)
          .and_return([200, { 'correlation_id' => 'CORR123' }])
      )
      user.full_name = 'Test user NEW'
      response = connector.update(user)
      expect(response[:one_time_password]).to be_nil
      expect(response[:identity_provider_sync][:aad][:perform_sync]).to be_falsey
      expect(response[:identity_provider_sync][:aad][:message]).to include('CORR123')
    end
  end

  describe '.syncable?' do
    it 'is not if the IDP of the user is not configured for this connector' do
      user_no_idp = User.new(user_name: 'testuser@test.org', full_name: 'Test user')

      expect(connector.syncable?(user_no_idp)).to be_falsey
    end

    it 'is when the IDP of the user is configured for this connector' do
      user.identity_provider_sync = { aad: { perform_sync: true } }

      expect(connector.syncable?(user)).to be_truthy
    end
  end

  describe '.new?' do
    it 'is if the user was never marked as synced' do
      user.identity_provider_sync = { aad: {} }

      expect(connector.new?(user)).to be_truthy
    end

    it 'is not if the user was marked as synced in the past' do
      user.identity_provider_sync = { aad: { synced_on: '2020-01-01' } }

      expect(connector.new?(user)).to be_falsey
    end
  end

  describe '.relevant_updates?' do
    it 'is if the full name of the user changed since last sync' do
      user.identity_provider_sync = { aad: { synced_values: { full_name: 'Test' } } }

      expect(connector.relevant_updates?(user)).to be_truthy
    end

    it 'is if the user was disabled since last sync' do
      user.identity_provider_sync = { aad: { synced_values: { enabled: false } } }

      expect(connector.relevant_updates?(user)).to be_truthy
    end

  end
end