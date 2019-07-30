# Query for forms

Show the JSON representation of a system setting. 

**URL** : `/api/v2/system_settings`

**Method** : `GET`

**Authentication** : YES

**Authorization** :The user must be authorized to view system settings in Primero.

## Success Response

**Condition** : User can see the system settings.

**Code** : `200 OK`

**Content** :

```json
{
    "data": {
        "id": 1,
        "default_locale": "en",
        "locales": [
            "en",
            "fr",
            "ar"
        ],
        "base_language": "en",
        "case_code_format": [],
        "case_code_separator": null,
        "auto_populate_list": [
            {
                "format": [
                    "name_first",
                    "name_middle",
                    "name_last"
                ],
                "field_key": "name",
                "separator": " ",
                "auto_populated": true
            }
        ],
        "unhcr_needs_codes_mapping": null,
        "reporting_location_config": {
            "field_key": "owned_by_location",
            "label_key": "district",
            "admin_level": 2,
            "hierarchy_filter": []
        },
        "age_ranges": {
            "unhcr": [
                "0 - 4",
                "5 - 11",
                "12 - 17",
                "18 - 59",
                "60+"
            ],
            "primero": [
                "0 - 5",
                "6 - 11",
                "12 - 17",
                "18+"
            ]
        },
        "welcome_email_text_i18n": {
            "en": "Click link below to log into Primero.  Please see your system administrator if you have any issues."
        },
        "primary_age_range": "primero",
        "location_limit_for_api": null,
        "approval_forms_to_alert": "{\"cp_bia_form\"=>\"bia\", \"cp_case_plan\"=>\"case_plan\", \"closure_form\"=>\"closure\"}",
        "changes_field_to_form": null,
        "export_config_id": "{\"unhcr\"=>\"export-unhcr-csv\", \"duplicate_id\"=>\"export-duplicate-id-csv\"}",
        "duplicate_export_field": "national_id_no",
        "primero_version": "2.0.0.1",
        "system_options": {
            "show_alerts": true,
            "welcome_email_enabled": false,
            "notification_email_enabled": true,
            "due_date_from_appointment_date": false
        },
        "agencies": [
            {
                "name": "UNICEF"
            }
        ],
        "modules": [
            {
                "unique_id": "primeromodule-cp",
                "name": "CP",
                "associated_record_types": [
                    "case",
                    "tracing_request",
                    "incident"
                ],
                "options": {
                    "allow_searchable_ids": true,
                    "use_workflow_case_plan": true,
                    "use_workflow_assessment": false,
                    "reporting_location_filter": true,
                    "use_workflow_service_implemented": true
                }
            },
            {
                "unique_id": "primeromodule-gbv",
                "name": "GBV",
                "associated_record_types": [
                    "case",
                    "incident"
                ],
                "options": {
                    "user_group_filter": true
                }
            }
        ]
    }
}
```
## Error Response

**Condition** : User isn't authorized to query for system settings. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/system_settings",
      "message": "Forbidden"
    }
  ]
}
```
