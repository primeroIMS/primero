<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->

# Query for cases

Show a list of case relationships on a case that are accessible to this user.

**URL** : `/api/v2/cases/53fb6f08-4bc5-4638-9a66-ce43fcec86cf/case_relationships`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view case and case relationships.

**Parameters** :

* `relationship_type` Type of relationships to query

## Success Response

**Condition** : User can see case relationships on a case.

**Code** : `200 OK`

**Content** :

```json
{
  "data": [
    {
      "id": "b3222e84-a5d7-4692-a643-1ab3d41f17d6",
      "case_id": "a7a6ffcd-4350-4a5a-900b-f1fc46c3a1c2" ,
      "relationship_type": "farmer_on",
      "primary": false,
      "data": {},
    },
    {
      "id": "b3222e84-a5d7-4692-a643-1ab3d41f17d6",
      "case_id": "55cf8ca1-2f99-43db-9101-bbd342dd9a8e" ,
      "relationship_type": "farmer_on",
      "primary": true,
      "data": {},
    }
  ],
}
```
## Error Response

**Condition** : User isn't authorized to query for case relationships.

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
