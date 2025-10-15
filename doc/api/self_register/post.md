<!-- Copyright (c) 2014 - 2025 UNICEF. All rights reserved. -->

# Create a new user

Create a new unverified user via self registration.

**URL** : `/api/v2/self_register`

**Method** : `POST`

**Authentication** : NO

**Authorization** : N/A

**Parameters** :

* `data` A JSON representation of the saved search to be created.

```json
{
    "user": {
        "full_name": "a new filter",
        "user_name": "case",
        "email": "testuser@test.com",
        "locale": "en",
        "data_processing_consent_provided": true,
        "registration_stream": "self_registration_beneficiary"
    }
}
```

## Success Response

**Condition** : User is created.

**Code** : `200 OK`

**Content** :

```json
{
}
```

---

## Error Response

**Condition** : Self registration is not allowed.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/users/self-register",
      "message": "Forbidden"
    }
  ]
}

