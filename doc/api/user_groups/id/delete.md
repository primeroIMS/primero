# Delete an existing user_group

Deletes a user_group with the specified id.

**URL** : `/api/v2/user_groups/:id`

**Method** : `DELETE`

**Authentication** : YES

**Authorization** : The user must be authorized to delete user_groups in Primero.

**Parameters** : No parameters

## Success Response

**Condition** : User can delete user_groups.

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "id": "100"
  }
}
```

## Error Response

**Condition** : User isn't authorized to delete user_group.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/user_groups/200",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : A user_group with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/user_groups/thisdoesntexist",
      "message": "Not Found"
    }
  ]
}
```