# Delete an existing location

Deletes a location with the specified id.

**URL** : `/api/v2/locations/:id`

**Method** : `DELETE`

**Authentication** : YES

**Authorization** : The user must be authorized to delete locations in Primero.

**Parameters** : No parameters

## Success Response

**Condition** : User can delete locations.

**Code** : `200 OK`

**Content** :

```json
{
    "data": {
        "id": 2
    }
}
```
## Error Response

**Condition** : User isn't authorized to delete locations.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/locations/200",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : A location with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/locations/150",
      "message": "Not Found"
    }
  ]
}
```