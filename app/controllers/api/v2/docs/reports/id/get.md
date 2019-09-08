# Fetch the individual report

Shows the JSON representation of a report. The report is built so that the report data is
available in the response.

**URL** : `/api/v2/reports/:id`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view reports in Primero.

**Parameters** :

## Success Response

**Condition** : User can view this report.

**Code** : `200 OK`

**Content** :

```json
{
    "data": {
        "id": 1,
        "name": {
            "en": "Registration CP",
            "fr": "Registration CP",
            "ar": "Registration CP"
        },
        "description": {
            "en": "Case registrations over time",
            "fr": "Case registrations over time",
            "ar": "Case registrations over time"
        },
        "graph": true,
        "graph_type": "bar",
        "fields": [
            {
                "name": "registration_date",
                "display_name": {
                    "en": "Date of Registration or Interview",
                    "fr": "",
                    "ar": ""
                },
                "position": {
                    "type": "horizontal",
                    "order": 0
                }
            }
        ],
        "report_data": {
            "May-2019": {
                "_total": 0
            },
            "Jun-2019": {
                "_total": 0
            },
            "Jul-2019": {
                "_total": 0
            },
            "Aug-2019": {
                "_total": 1
            },
            "Sep-2019": {
                "_total": 1
            }
        }
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
