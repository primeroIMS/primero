# frozen_string_literal: true

def create_or_update_identity_provider(setting_hash)
  unique_id = setting_hash[:unique_id]
  idp = IdentityProvider.find_by unique_id: unique_id

  if idp.nil?
    puts "Creating identity provider #{unique_id}"
    IdentityProvider.create setting_hash
  else
    puts "Updating identity provider #{unique_id}"
    idp.update_attributes setting_hash
  end
end

create_or_update_identity_provider(
  name: 'UNICEF',
  unique_id: 'unicef',
  provider_type: 'b2c',
  configuration: {
    client_id: 'e3443e90-18bc-4a23-9982-7fd5e67ff339',
    authorization_url: 'https://unicefpartners.b2clogin.com/tfp/unicefpartners.onmicrosoft.com/B2C_1_PrimeroSignUpSignIn',
    identity_scope: ['e3443e90-18bc-4a23-9982-7fd5e67ff339'],
    verification_url: 'https://unicefpartners.b2clogin.com/unicefpartners.onmicrosoft.com/discovery/v2.0/keys?p=B2C_1_PrimeroSignUpSignIn',
    issuer: 'https://unicefpartners.b2clogin.com/48e05529-88b8-40e1-825a-18c4e1077b3a/v2.0/'
  }
)

create_or_update_identity_provider(
  name: 'Primero',
  unique_id: 'primeroims',
  provider_type: 'b2c',
  configuration: {
    client_id: 'e3443e90-18bc-4a23-9982-7fd5e67ff339',
    authorization_url: 'https://unicefpartners.b2clogin.com/tfp/unicefpartners.onmicrosoft.com/B2C_1_PrimeroSignUpSignIn',
    identity_scope: ['e3443e90-18bc-4a23-9982-7fd5e67ff339'],
    verification_url: 'https://unicefpartners.b2clogin.com/unicefpartners.onmicrosoft.com/discovery/v2.0/keys?p=B2C_1_PrimeroSignUpSignIn',
    issuer: 'https://unicefpartners.b2clogin.com/48e05529-88b8-40e1-825a-18c4e1077b3a/v2.0/',
    identity_sync_connector: 'AzureActiveDirectoryConnector'
  }
)

create_or_update_identity_provider(
  name: 'Partner',
  unique_id: 'unitstonelogin',
  provider_type: 'b2c',
  configuration: {
    client_id: 'e3443e90-18bc-4a23-9982-7fd5e67ff339',
    authorization_url: 'https://unicefpartners.b2clogin.com/tfp/unicefpartners.onmicrosoft.com/B2C_1_PrimeroSignUpSignIn',
    identity_scope: ['e3443e90-18bc-4a23-9982-7fd5e67ff339'],
    verification_url: 'https://unicefpartners.b2clogin.com/unicefpartners.onmicrosoft.com/discovery/v2.0/keys?p=B2C_1_PrimeroSignUpSignIn',
    issuer: 'https://unicefpartners.b2clogin.com/48e05529-88b8-40e1-825a-18c4e1077b3a/v2.0/'
  }
)