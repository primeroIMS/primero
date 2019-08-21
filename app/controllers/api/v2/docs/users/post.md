# Create a new form

Create a new form

**URL** : `/api/v2/users`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to create users in Primero.

**Parameters** : 

* `data` A JSON representation of the forms to be created.
```json
{
    "data": {
        "full_name": "Primero CP",
        "user_name": "primero_cp",
        "code": "UNICEF/AGENCY_USER_ADMIN_CP",
        "email": "primero_cp@primero.com",
        "agency_id": 1,
        "role_id": 13,
        "time_zone": "UTC",
        "locale": "en",
        "send_mail": true,
        "module_ids": 1,
        "password_confirmation": "a12345678",
        "password": "a12345678"
        
    }
}
```

## Success Response

**Condition** : User can create users. 
No `id` attribute is provided in the `data` hash.

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
        "role_id": 13,
        "time_zone": "UTC",
        "locale": "en",
        "send_mail": true,
        "created_at": "2019-08-09T19:54:36.592Z",
        "updated_at": "2019-08-09T19:54:36.592Z"
    }
}
```

---

**Condition** : User can create users.
A client generated `id` attribute is provided in the `data` hash. 
This can be used to minimize the amount of data exchanged for low bandwidth scenarios.

**Code** : `204 No Content`

**Content** : The response has no content.

## Error Response

**Condition** : User isn't authorized to create users. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/users",
      "message": "Forbidden"
    }
  ]
}
```

---

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

---

**Condition** : A user with the provided id already exists in the database.

**Code** : `409 Conflict`

**Content** :

```json
{
  "errors": [
    {
      "code": 409,
      "resource": "/api/v2/users",
      "message": "Conflict"
    }
  ]
}
```

---

**Condition** : The parameters would create an invalid user.

**Code** : `422 Unprocessable Entity`

**Content** :

```json
{
  "errors": [
    {
      "code": 422,
      "resource": "/api/v2/users",
      "message": [
          "errors.models.user.password_confirmation"
      ],
      "detail": "password_confirmation"
    }
  ]
}
```
