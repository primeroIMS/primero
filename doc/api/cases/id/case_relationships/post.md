<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->

# Create a new case relationship

Create a new case relationship on a case. Returns the created case relationship.

**URL** : `/api/v2/cases/53fb6f08-4bc5-4638-9a66-ce43fcec86cf/case_relationships`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to create case relationships.

**Parameters** : 

* `data` A JSON representation of the record to be created.
```json
{
  "data": {
      "case_id": "a7a6ffcd-4350-4a5a-900b-f1fc46c3a1c2",
      "relationship_type": "farmer_on",
    }
}
```

## Success Response

**Condition** : User can create a case relationship on a case. 

**Code** : `200 OK`

**Content** :

```json
{
  "data":       {
      "id": "b3222e84-a5d7-4692-a643-1ab3d41f17d6",
      "case_id": "a7a6ffcd-4350-4a5a-900b-f1fc46c3a1c2" ,
      "relationship_type": "farmer_on",
      "primary": true,
      "data": {},
    },
}
```

---

## Error Response

**Condition** : User isn't authorized to create a case relationship. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/cases/53fb6f08-4bc5-4638-9a66-ce43fcec86cf/case_relationships",
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
      "resource": "/api/v2/cases/b3222e84-a5d7-4692-a643-1ab3d41f17d6/case_relationships",
      "message": "Not Found"
    }
  ]
}
```

---

**Condition** : A case relationship with the provided id already exists in the database.

**Code** : `409 Conflict`

**Content** :

```json
{
  "errors": [
    {
      "code": 409,
      "resource": "/api/v2/cases/b3222e84-a5d7-4692-a643-1ab3d41f17d6/case_relationships",
      "message": "Conflict"
    }
  ]
}
```