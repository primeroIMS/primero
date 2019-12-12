export const systemSettingsLogin = async () => {
  return {
    data: [
      {
        "id": 1,
        "unique_id": "unicef",
        "name": "UNICEF",
        "provider_type": "b2c",
        "client_id": "e3443e90-18bc-4a23-9982-7fd5e67ff339",
        "authorization_url": "https://unicefpartners.b2clogin.com/tfp/unicefpartners.onmicrosoft.com/B2C_1_PrimeroSignUpSignIn",
        "identity_scope": ["e3443e90-18bc-4a23-9982-7fd5e67ff339"],
        "verification_url": "https://unicefpartners.b2clogin.com/unicefpartners.onmicrosoft.com/discovery/v2.0/keys?p=B2C_1_PrimeroSignUpSignIn"
      },
      {
        "id": 2,
        "unique_id": "primeroims",
        "name": "Primero",
        "provider_type": "b2c",
        "client_id": "e3443e90-18bc-4a23-9982-7fd5e67ff339",
        "authorization_url": "https://unicefpartners.b2clogin.com/tfp/unicefpartners.onmicrosoft.com/B2C_1_PrimeroSignUpSignIn",
        "identity_scope": ["e3443e90-18bc-4a23-9982-7fd5e67ff339"],
        "verification_url": "https://unicefpartners.b2clogin.com/unicefpartners.onmicrosoft.com/discovery/v2.0/keys?p=B2C_1_PrimeroSignUpSignIn"
      },
      {
        "id": 3,
        "unique_id": "unitstonelogin",
        "name": "Partner",
        "provider_type": "b2c",
        "client_id": "e3443e90-18bc-4a23-9982-7fd5e67ff339",
        "authorization_url": "https://unicefpartners.b2clogin.com/tfp/unicefpartners.onmicrosoft.com/B2C_1_PrimeroSignUpSignIn",
        "identity_scope": ["e3443e90-18bc-4a23-9982-7fd5e67ff339"],
        "verification_url": "https://unicefpartners.b2clogin.com/unicefpartners.onmicrosoft.com/discovery/v2.0/keys?p=B2C_1_PrimeroSignUpSignIn"
      }
    ],
    "metadata": {
      "use_identity_provider": true
    }
  };
  // return {
  //   "default_locale": "en",
  //   "locales": ["en", "fr"],
  //   "agency_icons": [],
  //   "branding": "primero",
  //   "use_identity_provider": true,
  //   "identity_providers": [
  //     {
  //       "name": "UNICEF",
  //       "type": "b2c",
  //       "domain_hint": "unicef",
  //       "authority": "https://unicefpartners.b2clogin.com/tfp/unicefpartners.onmicrosoft.com/B2C_1_PrimeroSignUpSignIn",
  //       "client_id": "e3443e90-18bc-4a23-9982-7fd5e67ff339",
  //       "scope": ["e3443e90-18bc-4a23-9982-7fd5e67ff339"],
  //       "redirect_uri": "http://localhost:3000/v2/login/b2c"
  //     },
  //     {
  //       "name": "Primero",
  //       "type": "b2c",
  //       "domain_hint": "primeroims",
  //       "authority": "https://unicefpartners.b2clogin.com/tfp/unicefpartners.onmicrosoft.com/B2C_1_PrimeroSignUpSignIn",
  //       "client_id": "e3443e90-18bc-4a23-9982-7fd5e67ff339",
  //       "scope": ["e3443e90-18bc-4a23-9982-7fd5e67ff339"],
  //       "redirect_uri": "http://localhost:3000/v2/login/b2c"
  //     },
  //     {
  //       "name": "Partner",
  //       "type": "b2c",
  //       "domain_hint": "unitstonelogin",
  //       "authority": "https://unicefpartners.b2clogin.com/tfp/unicefpartners.onmicrosoft.com/B2C_1_PrimeroSignUpSignIn",
  //       "client_id": "e3443e90-18bc-4a23-9982-7fd5e67ff339",
  //       "scope": ["e3443e90-18bc-4a23-9982-7fd5e67ff339"],
  //       "redirect_uri": "http://localhost:3000/v2/login/b2c"
  //     },
  //   ]
  // };
};