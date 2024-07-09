<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->

# Update an existing registry record

Merge the values submitted in this call into an existing registry record.

**URL** : `/api/v2/registry_records/:id`

**Method** : `PATCH`

**Authentication** : YES

**Authorization** : The user must be authorized to edit registry records in Primero.

**Parameters** : 

* `data` A JSON representation of the record fields that will be updated.
```json
{
  "data": {
      "registry_type": "individual"
    }
}
```

## Success Response

**Condition** : User can update registry records.

**Code** : `200 OK`

**Content** : A JSON representation of all fields that changed as a result of this update
that the user is allowed to view.

```json
{
  "data": {
      "registry_type": "individual"
    }
}
```

## Error Response

**Condition** : User isn't authorized to update registry records. 

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

**Condition** : A registry record with the provided id doesn't exist in the database.. 

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

---

**Condition** : The registry parameters would create an invalid registry record.

**Code** : `422 Unprocessable Entity`

**Content** :

```json
{
  "errors": [
    {
      "code": 422,
      "resource": "/api/v2/registry_records",
      "message": "Please enter a valid registry type",
      "detail": "registry_type"
    }
  ]
}
```