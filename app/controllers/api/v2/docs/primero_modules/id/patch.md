# Update an existing primero_module

Merge the values submitted in this call into an existing primero_module.

**URL** : `/api/v2/primero_modules/:id`

**Method** : `PATCH`

**Authentication** : YES

**Authorization** : The user must be authorized to edit primero_modules in Primero.

**Parameters** :

* `data` A JSON representation of the primero_module fields that will be updated.

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
    "form_sections": [
      {
        "id": 2,
        "unique_id": "cp_incident_form",
        "name_i18n": {
          "en": "CP Incident"
        }
      },
      {
        "id": 3,
        "unique_id": "cp_offender_details",
        "name_i18n": {
          "en": "Perpetrator Details"
        }
      }
    ],
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
    },
    "primero_program": {
      "id": 1,
      "unique_id": "primeroprogram-primero",
      "name_i18n": {
        "en": "Primero"
      },
      "description_i18n": {
        "en": "Default Primero Program"
      },
      "start_date": null,
      "end_date": null,
      "core_resource": false
    }
  }
}
```

## Success Response

**Condition** : User can update primero_modules.

**Code** : `200 OK`

**Content** : A JSON representation of the primero_module that has been updated.

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
    "form_sections": [
      {
        "id": 2,
        "unique_id": "cp_incident_form",
        "name_i18n": {
          "en": "CP Incident"
        }
      },
      {
        "id": 3,
        "unique_id": "cp_offender_details",
        "name_i18n": {
          "en": "Perpetrator Details"
        }
      }
    ],
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
    },
    "primero_program": {
      "id": 1,
      "unique_id": "primeroprogram-primero",
      "name_i18n": {
        "en": "Primero"
      },
      "description_i18n": {
        "en": "Default Primero Program"
      },
      "start_date": null,
      "end_date": null,
      "core_resource": false
    }
  }
}
```

## Error Response

**Condition** : User isn't authorized to update primero_modules.

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

---

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

---