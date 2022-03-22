# Query for identity providers

Retrieve the current Primero identity providers as JSON

**URL** : `/api/v2/identity_providers`

**Method** : `GET`

**Authentication** : NO

**Parameters** : none

## Success Response

**Condition** : User can see the identity providers.

**Code** : `200 OK`

**Content** :

```json
{
    "data": [
        {
            "id": 1
            "name": "UNICEF",
            "unique_id": "unicef"
            "provider_type": "b2c"
            "authorization_url": "https://unicefpartners.b2clogin.com/tfp/unicefpartners.onmicrosoft.com/B2C_1_PrimeroSignUpSignIn",
            "client_id": "e3443e90-18bc-4a23-9982-7fd5e67ff339",
            "identity_scope": ["e3443e90-18bc-4a23-9982-7fd5e67ff339"],
            "verification_url": "https://unicefpartners.b2clogin.com/unicefpartners.onmicrosoft.com/discovery/v2.0/keys?p=B2C_1_PrimeroSignUpSignIn"

        },
        {
            "id": 2
            "name": "Primero",
            "unique_id": "primeroims"
            "provider_type": "b2c"
            "authorization_url": "https://unicefpartners.b2clogin.com/tfp/unicefpartners.onmicrosoft.com/B2C_1_PrimeroSignUpSignIn",
            "client_id": "e3443e90-18bc-4a23-9982-7fd5e67ff339",
            "identity_scope": ["e3443e90-18bc-4a23-9982-7fd5e67ff339"],
            "verification_url": "https://unicefpartners.b2clogin.com/unicefpartners.onmicrosoft.com/discovery/v2.0/keys?p=B2C_1_PrimeroSignUpSignIn"

        }
    ],
    "metadata": {
        "use_identity_provider": false
    }
}
```
