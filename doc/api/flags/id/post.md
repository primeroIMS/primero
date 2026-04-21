# Create a new flag

Create a new flag for a specific record, depends of the recordType and the record id. 
The recordType must be a cases, tracing_requests or incidents.

**URL** : `/api/v2/:recordType/:recordId/flags`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to flag records in Primero.

**Parameters** : 

* `data` A JSON representation of the flag to be created.
```json
{
  "data": {
      "date": '' ,
      "message": "This is a flag message"
    }
}
```

## Success Response

**Code** : `200 OK`

**Content** :

```json
{
    "data": {
        "id": 4,
        "record_id": "860ee0ca-0165-4ab8-8750-663cec9fb320",
        "record_type": "cases",
        "date": "2019-08-03",
        "message": "This is a flag message",
        "flagged_by": "primero",
        "removed": false,
        "unflag_message": null,
        "created_at": "2019-10-30T14:20:54.228Z",
        "system_generated_followup": false,
        "unflagged_by": null,
        "unflagged_date": null,
        "record_access_denied": false,
        "record": {
            "id": "860ee0ca-0165-4ab8-8750-663cec9fb320"
        }
    }
}

```

## Error Response

**Condition** : User isn't authorized to create flags. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "status": 403,
      "resource": "/api/v2/cases/749e9c6e-60db-45ec-8f5a-69da7c223a79/flags",
      "message": "Forbidden"
    }
  ]
}
```