# Request that a password reset email be sent out for this user

Trigger an email message to be sent out to the email associated with this user with a password resent token and link.

**URL** : `/api/v2/users/:id/password-reset-request`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The requesting user must be authorized to edit this user in Primero.

**Parameters** :

* `user` A JSON object with a `password_reset` flag. Note that we **are not** using the usual `data` key.

```json
{
  "user": {
    "password_reset": true
  }
}
```

## Success Response

**Condition** :  The requesting user is authorized to edit this user in Primero.

**Code** : `200 OK`

**Content** :

```json
{
  "data": [
    {
      "message": "user.password_reset.request_submitted"
    }
  ]
}
```

## Error Response

**Condition** : User isn't logged in

**Code** : `401 Unauthorized`

**Content** :

```json
{
  "errors": [
    {
      "code": 401,
      "resource": "/api/v2/users/10/password-reset-request",
      "message": "Unauthorized"
    }
  ]
}
```

---

**Condition** : User isn't authorized to update users.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/users/10/password-reset-request",
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
      "resource": "/api/v2/users/doesntexist/password-reset-request",
      "detail": "Couldn't find User with 'id'=deosntexist",
      "message": "Not Found"
    }
  ]
}
```
