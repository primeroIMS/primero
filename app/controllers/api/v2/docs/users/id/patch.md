# Update an existing user

**URL** : `/api/v2/users/:id`

**Method** : `PATCH`

**Authentication** : YES

**Authorization** : The user must be authorized to edit users in Primero.

**Parameters** : 

* `data` A JSON representation of the user that will be updated.
```json
{
    "data": {
        "full_name": "Primero admin CP",
    }
}
```

## Success Response

**Condition** : User can update users.

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
      "id": 10
}
```

## Error Response

**Condition** : User isn't authorized to update users. 

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

**Condition** : The Parameters would create an invalid user.

**Code** : `422 Unprocessable Entity`

**Content** :

```json
{
  "errors": [
    {
      "code": 422,
      "resource": "/api/v2/users",
      "message": [
        "can't be blank"
      ],
      "detail": "password"
    }
  ]
}
```
