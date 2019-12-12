export const systemSettingsLogin = async () => {
  return {
    "default_locale": "en",
    "locales": ["en", "fr"],
    "agency_icons": [],
    "branding": "primero",
    "use_identity_provider": true,
    "identity_providers": [
      {
        "name": "UNICEF",
        "type": "b2c",
        "domain_hint": "unicef",
        "authority": "https://unicefpartners.b2clogin.com/tfp/unicefpartners.onmicrosoft.com/B2C_1_PrimeroSignUpSignIn",
        "client_id": "e3443e90-18bc-4a23-9982-7fd5e67ff339",
        "scope": ["e3443e90-18bc-4a23-9982-7fd5e67ff339"],
        "redirect_uri": "http://localhost:3000/v2/login/b2c"
      },
      {
        "name": "Primero",
        "type": "b2c",
        "domain_hint": "primeroims",
        "authority": "https://unicefpartners.b2clogin.com/tfp/unicefpartners.onmicrosoft.com/B2C_1_PrimeroSignUpSignIn",
        "client_id": "e3443e90-18bc-4a23-9982-7fd5e67ff339",
        "scope": ["e3443e90-18bc-4a23-9982-7fd5e67ff339"],
        "redirect_uri": "http://localhost:3000/v2/login/b2c"
      },
      {
        "name": "Partner",
        "type": "b2c",
        "domain_hint": "unitstonelogin",
        "authority": "https://unicefpartners.b2clogin.com/tfp/unicefpartners.onmicrosoft.com/B2C_1_PrimeroSignUpSignIn",
        "client_id": "e3443e90-18bc-4a23-9982-7fd5e67ff339",
        "scope": ["e3443e90-18bc-4a23-9982-7fd5e67ff339"],
        "redirect_uri": "http://localhost:3000/v2/login/b2c"
      },
    ]
  };
};