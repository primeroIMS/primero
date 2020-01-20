# Query for Exports

Show a paginated list of all exports that are accessible to this user. 
This method can be used to poll for the status of ongoing export jobs.

**URL** : `/api/v2/exports`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to perform at least one export action on a record.
Only exports created by this user are viewable.

**Parameters** : 

* `status` Optional. Query by status. Can be used to poll for ongoing jobs. 
* `record_type` Optional. The record for which the export is being performed.
* `format` Optional. The type of export that is running.
* `page` Optional. Pagination. Defaults to 1
* `per` Optional. Records per page. Defaults to 20. 

## Success Response

**Condition** : User is authorized. 

**Code** : `200 OK`

**Content** :

```json
{
  "data": [
    {
      "id": 1,
      "status": "job.status.complete",
      "owned_by": "primero",
      "completed_on": "2020-01-15T02:33:30.078Z",
      "format": "json",
      "record_type": "case",
      "file_name": "cases-20200114.253525591.json",
      "export_file": "/rails/active_storage/blobs/XXXXX/1_cases-20200114.253525591.json.zip"
    }
  ],
  "metadata": {
    "total": 1,
    "per": 20,
    "page": 1
  }
}
```
## Error Response

**Condition** : User isn't authorized to perform exports. 

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
