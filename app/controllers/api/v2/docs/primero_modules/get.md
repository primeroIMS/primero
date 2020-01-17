# Query for primero_modules

Shows a paginated list of all primero_modules that are accessible to this user.

**URL** : `/api/v2/primero_modules`

**Method** : `GET`

**Authentication** : YES

**Authorization** :The user must be authorized to view primero_modules in Primero.

**Parameters** :

* `page` Optional. Pagination. Defaults to 1
* `per` Optional. Records per page. Defaults to 20.

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
      "form_sections": [
        {
          "id": 85,
          "unique_id": "photos_and_audio",
          "name_i18n": {
            "en": "Photos and Audio"
          },
          "help_text_i18n": null,
          "description_i18n": {
            "en": "All Photo and Audio Files Associated with a Child Record"
          },
          "parent_form": "case",
          "visible": true,
          "order": 10,
          "order_form_group": 140,
          "order_subform": 0,
          "form_group_keyed": false,
          "form_group_id": "photos_audio",
          "editable": false,
          "core_form": false,
          "is_nested": false,
          "is_first_tab": false,
          "initial_subforms": 0,
          "subform_prevent_item_removal": false,
          "subform_append_only": false,
          "subform_header_links": [],
          "display_help_text_view": true,
          "shared_subform": null,
          "shared_subform_group": null,
          "is_summary_section": false,
          "hide_subform_placeholder": false,
          "mobile_form": true,
          "header_message_link": null,
          "collapsed_field_names": null
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
      "form_sections": [
        {
          "id": 1,
          "unique_id": "incident_record_owner",
          "name_i18n": {
            "en": "Record Owner"
          },
          "help_text_i18n": null,
          "description_i18n": {
            "en": "Record Owner"
          },
          "parent_form": "incident",
          "visible": true,
          "order": 0,
          "order_form_group": 0,
          "order_subform": 0,
          "form_group_keyed": false,
          "form_group_id": "record_owner",
          "editable": false,
          "core_form": false,
          "is_nested": false,
          "is_first_tab": false,
          "initial_subforms": 0,
          "subform_prevent_item_removal": false,
          "subform_append_only": false,
          "subform_header_links": [],
          "display_help_text_view": false,
          "shared_subform": null,
          "shared_subform_group": null,
          "is_summary_section": false,
          "hide_subform_placeholder": false,
          "mobile_form": true,
          "header_message_link": null,
          "collapsed_field_names": null
        }
      ],
      "core_resource": false,
      "field_map": null,
      "module_options": {
        "user_group_filter": true
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
