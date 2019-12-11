def create_or_update_identity_provider(setting_hash)
  puts "Creating System Settings "
  IdentityProvider.create! setting_hash
end

create_or_update_identity_provider(
  {
    name: "UNICEF",
    unique_id: "unicef",
    provider_type: "b2c",
    configuration: {
      client_id: "e3443e90-18bc-4a23-9982-7fd5e67ff339",
      authorization_url: "https://unicefpartners.b2clogin.com/tfp/unicefpartners.onmicrosoft.com/B2C_1_PrimeroSignUpSignIn",
      identity_scope: ["e3443e90-18bc-4a23-9982-7fd5e67ff339"],
      verification_url: "https://unicefpartners.b2clogin.com/unicefpartners.onmicrosoft.com/discovery/v2.0/keys?p=B2C_1_PrimeroSignUpSignIn"
    }
  }
)

create_or_update_identity_provider(
  {
    name: "Primero",
    unique_id: "primeroims",
    provider_type: "b2c",
    configuration: {
      client_id: "e3443e90-18bc-4a23-9982-7fd5e67ff339",
      authorization_url: "https://unicefpartners.b2clogin.com/tfp/unicefpartners.onmicrosoft.com/B2C_1_PrimeroSignUpSignIn",
      identity_scope: ["e3443e90-18bc-4a23-9982-7fd5e67ff339"],
      verification_url: "https://unicefpartners.b2clogin.com/unicefpartners.onmicrosoft.com/discovery/v2.0/keys?p=B2C_1_PrimeroSignUpSignIn"
    }
  }
)

create_or_update_identity_provider(
  {
    name: "Partner",
    unique_id: "unitstonelogin",
    provider_type: "b2c",
    configuration: {
      client_id: "e3443e90-18bc-4a23-9982-7fd5e67ff339",
      authorization_url: "https://unicefpartners.b2clogin.com/tfp/unicefpartners.onmicrosoft.com/B2C_1_PrimeroSignUpSignIn",
      identity_scope: ["e3443e90-18bc-4a23-9982-7fd5e67ff339"],
      verification_url: "https://unicefpartners.b2clogin.com/unicefpartners.onmicrosoft.com/discovery/v2.0/keys?p=B2C_1_PrimeroSignUpSignIn"
    }
  }
)