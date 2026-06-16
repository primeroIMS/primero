# Update an existing flag

The patch endpoint is used to unflag an existing flag, depends of the record type, the record id and the id of the flag.
The recordType must be a cases, tracing_requests or incidents.

**URL** : `/api/v2/:recordType/:recordId/flags/:id`

**Method** : `PATCH`

**Authentication** : YES

**Authorization** : The user must be authorized to flag records in Primero.

**Parameters** : 

* `data` A JSON representation of unflag message.
```json
{
  "data": {
      "unflag_message": "This is a unflag message"
    }
}
```

## Success Response

**Condition** : User can update flags.

**Code** : `200 OK`

**Content** :

```json
{
    "data": {
        "record_id": "860ee0ca-0165-4ab8-8750-663cec9fb320",
        "record_type": "cases",
        "unflag_message": "This is a unflag message",
        "unflagged_date": "2019-10-30",
        "unflagged_by": "primero",
        "removed": true,
        "id": 3,
        "message": "This is a flag",
        "date": "2019-08-03",
        "flagged_by": "primero",
        "created_at": "2019-10-30T14:20:34.176Z",
        "system_generated_followup": false,
        "record_access_denied": false,
        "record": {
            "id": "860ee0ca-0165-4ab8-8750-663cec9fb320"
        }
    }
}
```

## Error Response

**Condition** : User isn't authorized to update flags.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/cases/749e9c6e-60db-45ec-8f5a-69da7c223a79/flags/1",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : A record with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/cases/749e9c6e-60db-45ec-8f5a-69da7c223a79/flags/1",
      "message": "Not Found"
    }
  ]
}
```