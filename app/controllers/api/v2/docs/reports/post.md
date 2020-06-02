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
          "order": 2
        }
      },
      {
        "name": 'protection_concerns',
        "position": {
          "type": 'horizontal',
          "order": 1
        }
      }
    ],
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
      "{\"name\"=>\"protection_concerns\", \"position\"=><ActionController::Parameters {\"type\"=>\"horizontal\", \"order\"=>\"1\"} permitted: true>}",
      "{\"name\"=>\"owned_by_location\", \"position\"=><ActionController::Parameters {\"type\"=>\"horizontal\", \"order\"=>\"2\"} permitted: true>}"
    ]
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

**Condition** : A report without name in english in the params.

**Code** : `422`

**Content** :

```json
{
  "errors": [
    {
      "status": 422,
      "resource": "/api/v2/reports",
      "detail": "name",
      "message": ["Name must not be blank"]
    }
  ]
}
```

---

**Condition** : A report without record_type in the params.

**Code** : `422`

**Content** :

```json
{
  "errors": [
    {
      "status": 422,
      "resource": "/api/v2/reports",
      "detail": "record_type",
      "message": ["can't be blank"]
    }
  ]
}
```

---

**Condition** : A report without fields in the params.

**Code** : `422`

**Content** :

```json
{
  "errors": [
    {
      "status": 422,
      "resource": "/api/v2/reports",
      "detail": "aggregate_by",
      "message": ["can't be blank"]
    }
  ]
}
```
