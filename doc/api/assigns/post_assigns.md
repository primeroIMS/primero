<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->

# Bulk assign

Assign cases in bulk to a single user.

**URL** : `/api/v2/cases/assigns`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to assign each individual record.

**Parameters** :

* `data` A JSON representation of the assignment. The `filters` parameter is used to filter records that will be reassigned to the `transitioned_to` user.
```json
{
  "data": {
      "filters": {
        "short_id": [
          "fbd6839","4c7084f", "2d4bc3d"
        ]
      },
      "transitioned_to": "primero_cp",
      "notes": "This is a bulk assignment"
    }
}
```

## Success Response

**Code** : `200 OK`. Note that the response code will still be 200 even if every assignment in the batch fails.

**Content** : Filters and user that will be used in a bulk assign job.

```json
{
    "data": {
      "filters": {
        "short_id": [
          "fbd6839","4c7084f", "2d4bc3d"
        ]
      },
      "transitioned_to": "primero_cp",
    }
}

```

## Error Response

**Condition** : User isn't authorized to assign.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "status": 403,
      "resource": "/api/v2/cases/assigns",
      "message": "Forbidden"
    }
  ]
}
```

## Error Response

**Condition** : User selected more than 100 cases

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "status": 403,
      "resource": "/api/v2/cases/assigns",
      "message": "case.messages.bulk_assign_limit"
    }
  ]
}
```
