# Update an existing report

Merge the values submitted in this call into an existing report.

**URL** : `/api/v2/reports/:id`

**Method** : `PATCH`

**Authentication** : YES

**Authorization** : The user must be authorized to edit reports in Primero.

**Parameters** :

* `data` A JSON representation of the report fields that will be updated.

```json
{
  "data": {
    "name": {
      "en": "Protection Concerns By Location",
      "es": "Preocupaciones de protección por ubicación"
    },
    "description": {
      "en": "Description test",
      "es": "Prueba de la descripcion"
    },
    "aggregate_counts_from": "protection_concerns",
    "filters": [{ "attribute": "status", "constraint": "", "value": ["open"] }],
    "group_ages": true,
    "group_dates_by": "year",
    "graph": true,
    "editable": true,
    "fields": [
      {
        "name": "owned_by_location",
        "position": {
          "type": "vertical",
          "order": 2
        }
      },
      {
        "name": "protection_concerns",
        "position": {
          "type": "horizontal",
          "order": 1
        }
      }
    ]
  }
}
```

## Success Response

**Condition** : User can update reports.

**Code** : `200 OK`

**Content** : A JSON representation of the report that has been updated.

```json
{
  "data": {
    "id": 173,
    "name": {"en": "Protection Concerns By Location", "es": "Preocupaciones de protección por ubicación", "fr": ""},
    "description": {"en": "Description test", "es": "Prueba de la descripcion", "fr": ""},
    "graph": true,
    "graph_type": "bar",
    "fields": [
      {
        "name": "protection_concerns",
        "display_name": { "en": "Protection Concerns", "es": "", "fr": "" },
        "position": { "type": "horizontal", "order": 0 }
      },
      {
        "name": "owned_by_location", "display_name": { "en": "Owned by location", "es": "", "fr": "" },
        "position": { "type": "vertical", "order": 0 }, "option_strings_source": "Location",
        "admin_level": 0
      }
    ]
  }
}
```

## Error Response

**Condition** : User isn't authorized to update reports.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/reports/100",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : An report with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/reports/thisdoesntexist",
      "message": "Not Found"
    }
  ]
}
```
