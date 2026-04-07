# Invalidate a JWT token

Invalidate the token currently passed in the Authorization header of this request

**URL** : `/api/v2/tokens`

**Method** : `DELETE`

**Authentication** : YES 

**Parameters** :

* `Authorization header` Needs to be set to expire this token.  

## Success Response

**Condition** : A valid token was passed in.   

**Code** : `200 OK`

**Content** :

```json
{}
```

## Error Response

TODO