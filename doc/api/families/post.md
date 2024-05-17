<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->

# Create a new family

Create a new family and optionally return the entire record, 
including attributes generated on the server.

**URL** : `/api/v2/families`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to edit families in Primero.
A user may only set the fields that this user is permitted to access. 

**Parameters** : 

* `data` A JSON representation of the record to be created.
```json
{
  "data": {
      "family_number": "2ef057e8"
    }
}
```
* `data["id"]` Optional. A client-generated primary key identifier for the record to be created. 
Must be formatted as a UUID.

## Success Response

**Condition** : User can create families. 
No `id` attribute is provided in the `data` hash.    

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
      "family_number": "2ef057e8",
      "created_at": "2019-05-10T05:34:59.514Z",
      "registration_date": "2019-05-10"
    }
}
```

---

**Condition** : User can create families
A client generated `id` attribute is provided in the `data` hash. 
This can be used to minimize the amount of data exchanged for low bandwidth scenarios.

**Code** : `204 No Content`

**Content** : The response has no content.

## Error Response

**Condition** : User isn't authorized to create families. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/families",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : A family with the provided id doesn't exist in the database.. 

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/families/b3222e84-a5d7-4692-a643-1ab3d41f17d6",
      "message": "Not Found"
    }
  ]
}
```

---

**Condition** : A family with the provided id already exists in the database.

**Code** : `409 Conflict`

**Content** :

```json
{
  "errors": [
    {
      "code": 409,
      "resource": "/api/v2/families",
      "message": "Conflict"
    }
  ]
}
```

---

**Condition** : The family parameters would create an invalid registry record.

**Code** : `422 Unprocessable Entity`

**Content** :

```json
{
  "errors": [
    {
      "code": 422,
      "resource": "/api/v2/families"
    }
  ]
}
```