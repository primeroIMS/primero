# Disable an existing case

A Primero case cannot be deleted via the API. If a user has permissions to disable the case,
the user can also re-enable it by setting the field `"status": true`.

**URL** : `/api/v2/cases/:id`

**Method** : `DELETE`

**Authentication** : YES

**Authorization** : The user must be authorized to disable cases in Primero. 

**Parameters** : No parameters 

## Success Response

**Condition** : User can disable cases.   

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "id": "b3222e84-a5d7-4692-a643-1ab3d41f17d6"
   }
}
```

## Error Response

**Condition** : User isn't authorized to disable cases. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/cases/b3222e84-a5d7-4692-a643-1ab3d41f17d6",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : A case with the provided id doesn't exist in the database.. 

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/cases/b3222e84-a5d7-4692-a643-1ab3d41f17d6",
      "message": "Not Found"
    }
  ]
}
```