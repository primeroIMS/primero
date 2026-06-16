# Disable an existing user

Deletes a user

**URL** : `/api/v2/users/:id`

**Method** : `DELETE`

**Authentication** : YES

**Authorization** : The user must be authorized to delete users in Primero. 

**Parameters** : No parameters 

## Success Response

**Condition** : User can delete users.

**Code** : `200 OK`

## Error Response

**Condition** : User isn't authorized to delete users.

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
