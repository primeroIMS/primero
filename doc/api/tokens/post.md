# Issue a new JWT token

A new API token is issued in the Authorization header of the response. 
The token is currently set to expire in 60 minutes. 
Issuing a new token does not invalidate un-expired tokens associated with this user.

**URL** : `/api/v2/tokens`

**Method** : `POST`

**Authentication** : Not required

**Parameters** :

* `Authorization header` Optional. If the header is set to a valid token, 
you do not need to pass in the user and password to issue a new token.
This can be used to refresh the token. 

* `user` A JSON object holding user name and password credentials.
```json
{
  "user": {
      "user_name": "primero",
      "password": "mysecretpassw0rd"
    }
}
```

## Success Response

**Condition** : A valid token or valid credentials are provided.     

**Code** : `200 OK`

**Content** :

```
HTTP/1.1 200 OK
Authorization: Bearer jwtheader.jwtpayload.jwtsecret
{
  "user_name": "primero"
}
```

## Error Response

**Condition** : User isn't authorized to create cases. 

**Code** : `401 Unauthorized`

**Content** :

```json
{
  "error": "Invalid User name or password."
}
```