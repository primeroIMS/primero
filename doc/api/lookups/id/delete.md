# Delete an existing lookup

Deletes a lookup with the specified id.

**URL** : `/api/v2/lookups/:id`

**Method** : `DELETE`

**Authentication** : YES

**Authorization** : The user must be authorized to delete lookups in Primero.

**Parameters** : No parameters

## Success Response

**Condition** : User can delete lookups.

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

**Condition** : User isn't authorized to delete lookups.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/lookups/200",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : A lookup with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/lookups/150",
      "message": "Not Found"
    }
  ]
}
```