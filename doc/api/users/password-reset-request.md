# Request that a password be reset for a given email

Submit an email to receive a link with a token to reset the password.

**URL** : `/api/v2/users/password-reset-request`

**Method** : `POST`

**Authentication** : NO

**Parameters** :

* `user` A JSON object holding the user email. Note that we **are not** using the usual `data` key.

```json
{
  "user": {
    "email": "useremail@sample-primero.org"
  }
}
```

## Success Response

**Condition** : You will always receive a success response with the i18n key for the message to display

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "message": "user.password_reset.request_submitted"
  }
}
```
