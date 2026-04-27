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
    "export_format": "csv",
    "record_type": "case",
    "file_name": "export-for-today.csv",
    "password": "mypassword"
  }
}
```

**Examples** :

To create a custom export to Excel, with explicitly selected forms and fields:
```json
{
  "data": {
    "export_format": "custom",
    "record_type": "case",
    "file_name": "myexport.xls",
    "password": "mypassword",
    "custom_export_params": {
      "form_unique_ids": ["basic_identity"],
      "field_names": ["age", "sex"],
    }
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
     "export_format": "csv",
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
