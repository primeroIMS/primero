<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->

# Bulk assign

Assign cases in bulk to a single user.

**URL** : `/api/v2/cases/assigns`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to assign each individual record.

**Parameters** :

* `data` A JSON representation of the assignment. Only the `transitioned_to` and `notes` are used.
```json
{
  "data": {
      "ids": ["749e9c6e-60db-45ec-8f5a-69da7c223a79", "dcea6052-07d9-4cfa-9abf-9a36987cdd25"],
      "transitioned_to": "primero_cp",
      "notes": "This is a bulk assignment"
    }
}
```

## Success Response

**Code** : `200 OK`. Note that the response code will still be 200 even if every assignment in the batch fails.

**Content** : List of records ids that will be processed in a bulk assign job.

```json
{
    "data": {
      "ids": ["749e9c6e-60db-45ec-8f5a-69da7c223a79", "dcea6052-07d9-4cfa-9abf-9a36987cdd25"],
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
