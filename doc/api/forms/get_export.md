# Export forms

Exports forms and lookups to an xlsx spreadsheet.  Each form is on a different tab/worksheet

**URL** : `/api/v2/forms/export`

**Method** : `GET`

**Authentication** : YES

**Authorization** :The user must be authorized to view forms in Primero.

**Parameters** : 

* `export_type` Required. For now, only 'xlsx' is supported.  Others (such as 'yaml') may come later.
* `file_name` Optional. If not passed, the exporter will generate a file name.
* `record_type` Optional. case, incident, or tracing_request.  If not passed, it defaults to case.
* `module_id` Optional. Filter forms by module. If not passed, it defaults to primeromodule-cp
* `visible` Optional. true: show only visible forms and fields.  false: show all forms and fields.  If not passed, it defaults to true

## Success Response

**Condition** : User can see one or more forms. 

**Code** : `200 OK`

**Content** :

```json
{
  "data": [
    {
           "status": "success",
           "total": 70,
           "export_file_name": "form_export_20201201.124822.xlsx",
           "export_file_url": "/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBa3NuIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--1f01bc5863108d7933e3f4c740155bb1e50058e0/form_export_20201201.124822.xlsx",
           "success_total": 70,
           "failure_total": nil,
           "failures": []
    }
  ]
}
```
## Error Response

**Condition** : Export type is not passed in.

**Code** : `422`

**Content** :

```json
{
  "errors": [
    {
      "message": "No Exporter Specified"
    }
  ]
}
```


**Condition** : User isn't authorized to query for forms. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/forms/export",
      "message": "Forbidden"
    }
  ]
}
```
