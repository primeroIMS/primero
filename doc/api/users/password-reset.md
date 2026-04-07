# Reset a password for a user given a password reset token

Reset the password and log the user if provided with a valid password reset token.
Tokens expire after a certain amount of time.

**URL** : `/api/v2/users/password-reset`

**Method** : `POST`

**Authentication** : NO

**Parameters** :

* `user` A JSON object with a `password_reset` flag. Note that we **are not** using the usual `data` key.

```json
{
  "user": {
    "password_reset_token": "ABC123-valid-unexpired-token",
    "password": "new-password",
    "password_confirmation": "new-password"
  }
}
```

## Success Response

**Condition** :  The valid, unexpired token is associated with an existing user and the password and password confirmation match.

**Code** : `200 OK`

**Content** :

```json
{
  "id": 1,
  "user_name": "username",
  "token": "new-jwt-token",
  "message": "user.password_reset.success",
}
```

## Error Response

**Condition** : Token is invalid, expired, or the passwords are mismatched

**Code** : `422 Unprocessable Entity`

**Content** :

The `errors.message` value will be either `user.password_reset.reset_password_token` or `user.password_reset.password_confirmation`

```json
{
  "errors": [
    {
      "code": 422,
      "resource": "/api/v2/users/password-reset",
      "message": "user.password_reset.reset_password_token"
    }
  ]
}
```
