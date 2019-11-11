# Query for reports

Shows a paginated list of all reports that are accessible to this user. The reports are not built,
therefore the report data is not available in the response.

**URL** : `/api/v2/reports`

**Method** : `GET`

**Authentication** : YES

**Authorization** :The user must be authorized to view users in Primero.

**Parameters** :

* `page` Optional. Pagination. Defaults to 1
* `per` Optional. Reports per page. Defaults to 20.

## Success Response

**Condition** : User can see one or more reports.

**Code** : `200 OK`

**Content** :

```json
{
    "data": [
        {
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
            "graph_type": "bar"
        },
    ],
    "metadata": {
      "total": 1,
      "per": 20,
      "page": 1
    }

}
```
## Error Response

**Condition** : User isn't authorized to query for reports.

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
