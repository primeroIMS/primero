# Query for flag

Show a list of all flags from a records. depends of the recordType and the record id. 

**URL** : `/api/v2/:recordType/:recordId/flags`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to flag records in Primero.

**Parameters** : No parameters 

## Success Response

**Condition** : User can see one or more flags of a record. 

**Code** : `200 OK`

**Content** :

```json
{
    "data": [
        {
            "record_id": "749e9c6e-60db-45ec-8f5a-69da7c223a79",
            "record_type": "Child",
            "date": "2019-08-01",
            "message": "This is a flag",
            "flagged_by": "primero",
            "removed": false,
            "unflag_message": null,
            "created_at": "2019-08-16T22:11:16.737Z",
            "system_generated_followup": false,
            "unflagged_by": null,
            "unflagged_date": null
        },
        {
            "record_id": "749e9c6e-60db-45ec-8f5a-69da7c223a79",
            "record_type": "Child",
            "date": "2019-08-01",
            "message": "This is a flag",
            "flagged_by": "primero",
            "removed": false,
            "unflag_message": null,
            "created_at": "2019-08-16T22:03:34.511Z",
            "system_generated_followup": false,
            "unflagged_by": null,
            "unflagged_date": null
        }
    ]
}
```
## Error Response

**Condition** : User isn't authorized to create a flag.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/cases/749e9c6e-60db-45ec-8f5a-69da7c223a79/flags",
      "message": "Forbidden"
    }
  ]
}
```
