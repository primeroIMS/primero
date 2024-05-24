<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->

# Fetch the individual managed report

Shows the JSON representation of a managed report. The managed report is built if `build_report` params is
present so in that case the report data is available in the response.

**URL** : `/api/v2/managed_reports/:id`

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
    "id": "violations",
    "name": "managed_reports.violations.name",
    "description": "managed_reports.violations.description",
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

**Condition** : User isn't authorized to view this managed report.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/managed_reports/10",
      "message": "Forbidden"
    }
  ]
}

```
**Condition** : A managed report with the provided id doesn't exist.

**Code** : `422 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 422,
      "resource": "/api/v2/managed_reports/10",
      "message": ""message": "Errors::InvalidPrimeroEntityType""
    }
  ]
}

```
