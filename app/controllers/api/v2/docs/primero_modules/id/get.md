# Fetch the individual primero_module

Show the JSON representation of a primero_module.

**URL** : `/api/v2/primero_modules/:id`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view a primero_module in Primero.

**Parameters** :

## Success Response

**Condition** : User can view this primero_module.

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "id": 1,
    "unique_id": "primeromodule-cp",
    "name": "CP",
    "description": "Child Protection",
    "associated_record_types": [
      "case",
    ],
    "form_section_unique_ids": [ "cp_incident_form", "cp_offender_details" ],
    "core_resource": false,
    "field_map": {
      "fields": [
        {
          "source": [
            "incident_details",
            "cp_incident_identification_violence"
          ],
          "target": "cp_incident_identification_violence"
        }
      ],
      "map_to": "primeromodule-cp"
    },
    "module_options": {
      "allow_searchable_ids": true,
      "use_workflow_case_plan": true,
      "use_workflow_assessment": false
    }
  }
}
```
## Error Response

**Condition** : User isn't authorized to view this primero_module.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/primero_modules/100",
      "message": "Forbidden"
    }
  ]
}

```
**Condition** : A primero_module with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/primero_modules/thisdoesntexist",
      "message": "Not Found"
    }
  ]
}

```
