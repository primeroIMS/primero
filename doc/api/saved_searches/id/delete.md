# Delete an existing saved search

**URL** : `/api/v2/saved_searches/:id`

**Method** : `DELETE`

**Authentication** : YES

**Authorization** : The user must be authorized to delete saved searches in Primero.

**Parameters** : No parameters

## Success Response

**Condition** : User can delete saved searches.

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "id": "8"
   }
}
```

## Error Response

**Condition** : User isn't authorized to delete saved searches.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/saved_searches/1",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : A saved search with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/saved_searches/5",
      "message": "Not Found"
    }
  ]
}
```
