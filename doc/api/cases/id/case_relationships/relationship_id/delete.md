<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->

# Disable an existing case relationship

**URL** : `/api/v2/cases/:id/case_relationships/:relationship_id`

**Method** : `DELETE`

**Authentication** : YES

**Authorization** : The user must be authorized to delete case relationships. 

**Parameters** : No parameters 

## Success Response

**Condition** : User can delete case relationships.   

**Code** : `200 OK`

**Content** :


## Error Response

**Condition** : User isn't authorized to delete case relationship. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/cases/b3222e84-a5d7-4692-a643-1ab3d41f17d6/case_relationships/53fb6f08-4bc5-4638-9a66-ce43fcec86cf",
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
      "resource": "/api/v2/cases/b3222e84-a5d7-4692-a643-1ab3d41f17d6/case_relationships/53fb6f08-4bc5-4638-9a66-ce43fcec86cf",
      "message": "Not Found"
    }
  ]
}
```