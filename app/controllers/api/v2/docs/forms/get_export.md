# Export forms

Exports forms and lookups to an xlsx spreadsheet.  Each form is on a different tab/worksheet

**URL** : `/api/v2/forms/export`

**Method** : `GET`

**Authentication** : YES

**Authorization** :The user must be authorized to view forms in Primero.

**Parameters** : 

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
           "file_name": "form_export_20201117.093352.xlsx",
           "success_total": 70,
           "failure_total": nil,
           "failures": []
    }
  ]
}
```
## Error Response

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
