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

**Content** : The created assignment records, and an error object per failed assignment.

```json
{
    "data": [
        {
            "id": "749e9c6e-60db-45ec-8f5a-69da7c223a79",
            "type": "Assign",
            "record_id": "437189fc-cd1c-46ee-8d56-2891fc73605f",
            "record_type": "Child",
            "transitioned_to": "primero_cp",
            "transitioned_by": "primero",
            "notes": "This is a bulk assignment",
            "created_at": "2019-09-16T18:37:16.078Z"
        },
        {
            "id": "dcea6052-07d9-4cfa-9abf-9a36987cdd25",
            "type": "Assign",
            "record_id": "437189fc-cd1c-46ee-8d56-2891fc73605a",
            "record_type": "Child",
            "transitioned_to": "primero_cp",
            "transitioned_by": "primero",
            "notes": "This is a bulk assignment",
            "created_at": "2019-09-16T18:37:16.078Z"
        }
    ],
    "errors": [
        {
            "status": 422,
            "resource": "/api/v2/cases/assigns",
            "detail": "transitioned_to",
            "message": [ "transition.errors.to_user_can_receive" ]
         }
    ]
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
