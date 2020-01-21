# Fetch the individual export

Show the JSON representation of the export. 

**URL** : `/api/v2/exports/:id`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to perform exports 
and the user had initiated this export.


## Success Response

**Condition** : User is authorized.

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

**Condition** : User isn't authorized.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/exports/1",
      "message": "Forbidden"
    }
  ]
}

```
**Condition** : An export with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/exports/doesnt-exist",
      "message": "Not Found"
    }
  ]
}

```
