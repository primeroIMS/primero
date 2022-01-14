# Fetch the individual managed report

Shows the JSON representation of a managed report. The managed report is built if `build_report` params is
present so in that case the report data is available in the response.

**URL** : `/api/v2/reports/:id`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view managed reports in Primero.

**Parameters** :

## Success Response

**Condition** : User can view managed report.

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "id": "violations_report",
    "name": "violation_report.name",
    "description": "violation_report.description",
    "module_id": "primeromodule-mrm",
    "subreports": [
      "killing",
      "maiming",
      "recruitment",
      "sexual_violence",
      "abduction",
      "attack_on",
      "military_use",
      "denial_humanitarian_access"
    ]
  }
}

```
## Error Response

**Condition** : User isn't authorized to view this report.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/reports/10",
      "message": "Forbidden"
    }
  ]
}

```
**Condition** : A report with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/reports/10",
      "message": "Not Found"
    }
  ]
}

```
