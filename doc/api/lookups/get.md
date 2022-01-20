# Query for lookups

Shows a paginated list of all lookups that are accessible to this user.

**URL** : `/api/v2/lookups`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view lookups in Primero.

**Parameters** :

* `page` Optional. Pagination. Defaults to 1
* `per` Optional. Records per page. Defaults to 20.

## Success Response

**Condition** : User can see one or more lookups.

**Code** : `200 OK`

**Content** :

```json
{
  "data": [
   {
     "id": 1,
     "unique_id": "lookup-nationality",
     "name": {
          "en": "Nationality",
          "fr": "",
          "es": ""
     },
     "values": [
        {
        "id": "nationality1",
        "display_text": {
          "en": "Nationality",
          "fr": "",
          "es": ""
          }
        }
      ]
    },
    {
      "id": 2,
      "unique_id": "lookup-case-status",
      "name": {
          "en": "Case Status",
          "fr": "",
          "es": ""
      },
      "values": [
            {
                "id": "open",
                "display_text": {
                    "en": "Open",
                    "es": ""
                    "fr": "",
                }
            },
            {
                "id": "closed",
                "display_text": {
                    "en": "Closed",
                    "fr": "",
                    "es": ""
                }
            },
            {
                "id": "transferred",
                "display_text": {
                    "en": "Transferred",
                    "fr": "",
                    "es": ""
                }
            },
            {
                "id": "duplicate",
                "display_text": {
                    "en": "Duplicate",
                    "fr": "",
                    "es": ""
                }
            }
        ]
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

**Condition** : User isn't authorized to query for lookups.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/lookups",
      "message": "Forbidden"
    }
  ]
}
```
