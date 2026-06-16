# Archive an existing export

The export will be marked as "archived", and the associated file will be deleted.

**URL** : `/api/v2/exports/:id`

**Method** : `DELETE`

**Authentication** : YES

**Authorization** : The user must be authorized to perform exports 
and mus be the original creator of this exports

**Parameters** : No parameters 

## Success Response

**Condition** : User is authorized.  

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "id": "1"
   }
}
```

## Error Response

**Condition** : User isn't authorized.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/exports/1",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : An export with the provided id doesn't exist in the database.. 

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/exports/doesnt-exist",
      "message": "Not Found"
    }
  ]
}
```