# Create a new report

Create a new report and return the entire record.

**URL** : `/api/v2/reports`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to create reports in Primero.

**Parameters** :

* `data` A JSON representation of the report to be created.
```json
{
  "data": {
    "name": {
      "en": 'Test report',
      "fr": 'Test report in French'
    },
    "description": {
      "en": 'Description',
      "fr": 'Description in French'
    },
    "record_type": 'case',
    "module_id": PrimeroModule::CP,
    "graph": false,
    "fields": [
      {
        "name": 'owned_by_location',
        "position": {
          "type": 'horizontal',
          "order": 1
        }
      },
      {
        "name": 'protection_concerns',
        "position": {
          "type": 'horizontal',
          "order": 2
        }
      }
    ],
    "aggregate_by": ['owned_by_location'],
    "disaggregate_by": ['protection_concerns'],
    "aggregate_counts_from": 'protection_concerns',
    "group_ages": false,
    "group_dates_by": 'date',
    "add_default_filters": true,
    "filters": [
      {
        "attribute": 'status',
        "constraint": '',
        "value": [Record::STATUS_OPEN]
      }
    ]
  }
}
```

## Success Response

**Condition** : User can create report.

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "id": 102,
    "name": {"en": "Test report", "es": "", "fr": "Test report in French"},
    "description": {"en": "Description", "es": "", "fr": "Description in French"},
    "graph": false,
    "graph_type": "bar",
    "fields": [
      {
        "name": "owned_by_location", "display_name": {"en": "Owned by location", "es": "", "fr": ""},
        "position": {"type": "horizontal", "order": 0}, "option_strings_source": "Location", "admin_level": 0
      },
      {
        "name": "protection_concerns", "display_name": {"en": "Protection Concerns", "es": "", "fr": ""},
        "position": {"type": "vertical", "order": 0}
      }
    ],
    "report_data": {
      "cn": {
        "migrant": {"_total": 1, "migrant": {"_total": 1}, "sexually_exploited": {"_total": 1}, "trafficked_smuggled": {"_total": 1}},
        "sexually_exploited": {"migrant": {"_total": 1}, "sexually_exploited": {"_total": 1}, "trafficked_smuggled": {"_total": 1}, "_total": 1},
        "trafficked_smuggled": {"migrant": {"_total": 1}, "sexually_exploited": {"_total": 1}, "trafficked_smuggled": {"_total": 1}, "_total": 1},
        "_total": 1
      }
    }
  }
}
```

---

**Condition** : User isn't authorized to create reports.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/reports",
      "message": "Forbidden"
    }
  ]
}
```

---