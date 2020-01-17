# Delete an existing primero_module

Deletes a primero_module with the specified id.

**URL** : `/api/v2/primero_modules/:id`

**Method** : `DELETE`

**Authentication** : YES

**Authorization** : The user must be authorized to delete primero_module in Primero.

**Parameters** : No parameters

## Success Response

**Condition** : User can delete primero_modules.

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

**Condition** : User isn't authorized to delete primero_module.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/primero_modules/200",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : A primero_module with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/primero_modules/thisdoesntexist",
      "message": "Not Found"
    }
  ]
}
```