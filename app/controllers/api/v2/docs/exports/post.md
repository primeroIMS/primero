# Generate an export

Asynchronously start a new export job.

**URL** : `/api/v2/exports`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to 
perform exports for the format requested for this record type. 

**Parameters** : 

* `data` A JSON representation of the record to be created.
```json
{
  "data": {
      "format": "csv",
      "record_type": "case",
      "file_name": "export-for-today.csv",
      "password": "mypassword"
    }
}
```

## Success Response

**Condition** : Authorized.   

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
     "id": 1,
     "status": "job.status.processing",
     "owned_by": "primero",
     "completed_on": "2020-01-15T02:33:30.078Z",
     "format": "csv",
     "record_type": "case",
     "file_name": "export-for-today.csv"
  }
}
```

## Error Response

**Condition** : User isn't authorized to export this format for this record type 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/exports",
      "message": "Forbidden"
    }
  ]
}
```