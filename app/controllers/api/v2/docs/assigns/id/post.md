# Assign record

Assign an individual case to a single user.

**URL** : `/api/v2/cases/:id/assigns`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to assign the record.

**Parameters** : 

* `data` A JSON representation of the assignment. Only the `transitioned_to` and `notes` are used.
```json
{
  "data": {
      "transitioned_to": "primero_cp",
      "notes": "This is an assignment"
    }
}
```

## Success Response

**Code** : `200 OK`

**Content** : The created assignment records.

```json
{
    "data": {
        "id": "749e9c6e-60db-45ec-8f5a-69da7c223a79",
        "type": "Assign",
        "record_id": "437189fc-cd1c-46ee-8d56-2891fc73605f",
        "record_type": "Child",
        "transitioned_to": "primero_cp",
        "transitioned_by": "primero",
        "notes": "This is an assignment",
        "created_at": "2019-09-16T18:37:16.078Z"
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