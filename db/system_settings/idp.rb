def create_or_update_system_setting(setting_hash)
  #There should only be 1 row in system settings

  system_setting = SystemSettings.first

  if system_setting.nil?
    puts "Creating System Settings "
    SystemSettings.create! setting_hash
  else
    puts "Updating System Settings"
    system_setting.update_attributes setting_hash
  end
end

create_or_update_system_setting(
  identity_providers: [
    {
      name: "UNICEF"
      unique_id: "primeroims"
      provider_type: "b2c"
      client_id: "e3443e90-18bc-4a23-9982-7fd5e67ff339"
      authorization_url: "https://unicefpartners.b2clogin.com/tfp/unicefpartners.onmicrosoft.com/B2C_1_PrimeroSignUpSignIn"
      identity_scope: ["e3443e90-18bc-4a23-9982-7fd5e67ff339"]
      verification_url: "https://unicefpartners.b2clogin.com/unicefpartners.onmicrosoft.com/discovery/v2.0/keys?p=B2C_1_PrimeroSignUpSignIn"
    },
    {
      name: "Primero"
      unique_id: "primero"
      provider_type: "b2c"
      client_id: "e3443e90-18bc-4a23-9982-7fd5e67ff339"
      authorization_url: "https://unicefpartners.b2clogin.com/tfp/unicefpartners.onmicrosoft.com/B2C_1_PrimeroSignUpSignIn"
      identity_scope: ["e3443e90-18bc-4a23-9982-7fd5e67ff339"]
      verification_url: "https://unicefpartners.b2clogin.com/unicefpartners.onmicrosoft.com/discovery/v2.0/keys?p=B2C_1_PrimeroSignUpSignIn"
    },
    {
      name: "Partner"
      unique_id: "unitstonelogin"
      provider_type: "b2c"
      client_id: "e3443e90-18bc-4a23-9982-7fd5e67ff339"
      authorization_url: "https://unicefpartners.b2clogin.com/tfp/unicefpartners.onmicrosoft.com/B2C_1_PrimeroSignUpSignIn"
      identity_scope: ["e3443e90-18bc-4a23-9982-7fd5e67ff339"]
      verification_url: "https://unicefpartners.b2clogin.com/unicefpartners.onmicrosoft.com/discovery/v2.0/keys?p=B2C_1_PrimeroSignUpSignIn"
    }
  ]
)