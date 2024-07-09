<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->

# Query for Families

Show a paginated list of all families that are accessible to this user. The user can filter the family list based on search criteria.

**URL** : `/api/v2/families`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view families in Primero.

**Parameters** :

* `family_number` Optional.
* `page` Optional. Pagination. Defaults to 1
* `per` Optional. Records per page. Defaults to 20. Maximum is 1000

## Success Response

**Condition** : User can see one or more families.

**Code** : `200 OK`

**Content** :

```json
{
  "data": [
    {
      "id": "96e28004-3c9e-42bd-885b-08a138139c1e",
      "enabled": true,
      "status": "open",
      "short_id": "9e86779",
      "created_at": "2022-02-04T21:44:57.056Z",
      "record_state": true,
      "family_number": "40bf9109",
      "last_updated_at": "2022-02-04T21:44:57.056Z",
      "associated_user_names": [],
      "record_in_scope": true,
      "alert_count": 0
    },
    {
      "id": "317e0667-e5ec-4c28-a9bc-e60ceb311168",
      "enabled": true,
      "status": "open",
      "short_id": "62bdf5f",
      "created_at": "2022-02-04T21:43:13.561Z",
      "record_state": true,
      "family_number": "8962e835",
      "last_updated_at": "2022-02-04T21:43:13.561Z",
      "associated_user_names": [],
      "record_in_scope": true,
      "alert_count": 0
    },
  ],
  "metadata": {
      "total": 2,
      "per": 20,
      "page": 1
  }
}
```
## Error Response

**Condition** : User isn't authorized to query for families.

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
