# Fetch the individual user

Show the JSON representation of a user. 

**URL** : `/api/v2/users/:id`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view users in Primero.

**Parameters** : 

* `extended` Optional. Shows an extended version of the user properties. Defaults to false.

## Success Response

**Condition** : User can view this user. 

**Code** : `200 OK`

**Content** :

```json
{
    "data": {
        "id": 1,
        "full_name": "Primero CP",
        "user_name": "primero_cp",
        "email": "primero_cp@primero.com",
        "agency_id": 1,
        "role_id": "role-primero-cp",
        "time_zone": "UTC",
        "locale": "en",
        "send_mail": true,
        "created_at": "2019-08-09T19:54:36.592Z",
        "updated_at": "2019-08-09T19:54:36.592Z",
        "identity_provider_unique_id": "primeroims_2"
    }
}

```
## Error Response

**Condition** : User isn't authorized to view this user. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/users/10",
      "message": "Forbidden"
    }
  ]
}

```
**Condition** : A user with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/users/10",
      "message": "Not Found"
    }
  ]
}

```
