<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->

# Disable an existing registry record

A Primero registry record cannot be deleted via the API. If a user has permissions to disable the registry record,
the user can also re-enable it by setting the field `"status": true`.

**URL** : `/api/v2/registry_records/:id

**Method** : `DELETE`

**Authentication** : YES

**Authorization** : The user must be authorized to disable registries in Primero. 

**Parameters** : No parameters 

## Success Response

**Condition** : User can disable registries.   

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

**Condition** : User isn't authorized to disable registries. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/registry_records/b3222e84-a5d7-4692-a643-1ab3d41f17d6",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : A registry with the provided id doesn't exist in the database.. 

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/registry_records/b3222e84-a5d7-4692-a643-1ab3d41f17d6",
      "message": "Not Found"
    }
  ]
}
```