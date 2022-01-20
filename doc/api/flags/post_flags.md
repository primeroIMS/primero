# Create a bulk flags

Create a multiple flag for a list of records, depends of the recordType and array of ids 
The recordType must be a cases, tracing_requests or incidents.

**URL** : `/api/v2/:recordType/flags`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to flag records in Primero.

**Parameters** : 

* `data` A JSON representation of the flags to be created, include the list of records ids and the record type.
```json
{
  "data": {
      "ids": ["749e9c6e-60db-45ec-8f5a-69da7c223a79", "dcea6052-07d9-4cfa-9abf-9a36987cdd25"],
      "record_type": "case|incidenyt|tracing_request",
      "date": '' ,
      "message": "This is a bluk flag message"
    }
}
```

## Success Response

**Code** : `204 No Content`

**Content** : The response has no content.

## Error Response

**Condition** : User isn't authorized to create flags. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "status": 403,
      "resource": "/api/v2/cases/flags",
      "message": "Forbidden"
    }
  ]
}
```