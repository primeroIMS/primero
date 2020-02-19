# Delete an existing role

Deletes a role with the specified id.

**URL** : `/api/v2/roles/:id`

**Method** : `DELETE`

**Authentication** : YES

**Authorization** : The user must be authorized to delete roles in Primero.

**Parameters** : No parameters

## Success Response

**Condition** : User can delete roles.

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

**Condition** : User isn't authorized to delete role.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/roles/200",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : A role with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/roles/thisdoesntexist",
      "message": "Not Found"
    }
  ]
}
```