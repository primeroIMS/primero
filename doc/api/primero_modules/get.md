# Query for primero_modules

Shows a list of all primero_modules that are accessible to this user.

**URL** : `/api/v2/primero_modules`

**Method** : `GET`

**Authentication** : YES

**Authorization** :The user must be authorized to view primero_modules in Primero.

**Parameters** :

## Success Response

**Condition** : User can see one or more primero_modules.

**Code** : `200 OK`

**Content** :

```json
{
  "data": [
    {
      "id": 1,
      "unique_id": "primeromodule-cp",
      "name": "CP",
      "description": "Child Protection",
      "associated_record_types": [
        "case",
        "tracing_request",
        "incident"
      ],
      "form_section_unique_ids": [ "photos_and_audio", "cp_offender_details" ],
      "core_resource": false,
      "field_map": {
        "fields": [
          {
            "source": [
              "incident_details",
              "cp_incident_identification_violence"
            ],
            "target": "cp_incident_identification_violence"
          },
          {
            "source": [
              "incident_details",
              "cp_incident_date"
            ],
            "target": "cp_incident_date"
          }
        ],
        "map_to": "primeromodule-cp"
      },
      "module_options": {
        "allow_searchable_ids": true,
        "use_workflow_case_plan": true,
        "use_workflow_assessment": false
      }
    },
    {
      "id": 2,
      "unique_id": "primeromodule-gbv",
      "name": "GBV",
      "description": "Gender Based Violence",
      "associated_record_types": [
        "case",
        "incident"
      ],
      "form_section_unique_ids": [ "incident_record_owner" ],
      "core_resource": false,
      "field_map": null,
      "module_options": {
        "user_group_filter": true
      }
    }
  ],
  "metadata": {
    "total": 2,
    "per": 20,
    "page": 1
  }
}
```
## Error Response

**Condition** : User isn't authorized to query for primero_modules.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/primero_modules",
      "message": "Forbidden"
    }
  ]
}
```
