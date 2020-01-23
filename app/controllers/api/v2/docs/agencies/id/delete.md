# Disable an existing agency

Disable an agency with the specified id.

**URL** : `/api/v2/agencies/:id`

**Method** : `DELETE`

**Authentication** : YES

**Authorization** : The user must be authorized to disable agencies in Primero.

**Parameters** : No parameters

## Success Response

**Condition** : User can disable agencies.

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

**Condition** : User isn't authorized to disable agency.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/agencies/200",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : A agency with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/agencies/thisdoesntexist",
      "message": "Not Found"
    }
  ]
}
```