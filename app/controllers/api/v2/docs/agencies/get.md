# Query for agencies

Shows a paginated list of all agencies that are accessible to this user.

**URL** : `/api/v2/agencies`

**Method** : `GET`

**Authentication** : YES

**Authorization** :The user must be authorized to view agencies in Primero.

**Parameters** :

* `page` Optional. Pagination. Defaults to 1
* `per` Optional. Records per page. Defaults to 20.

## Success Response

**Condition** : User can see one or more agencies.

**Code** : `200 OK`

**Content** :

```json
{
  "data": [
    {
      "id": 1,
      "unique_id": "agency-unicef",
      "agency_code": "UNICEF",
      "order": 0,
      "name": {
        "en": "UNICEF",
        "fr": "",
        "ar": "",
        "ar-LB": "",
        "so": "",
        "es": "",
        "bn": ""
      },
      "description": {
        "en": "",
        "fr": "",
        "ar": "",
        "ar-LB": "",
        "so": "",
        "es": "",
        "bn": ""
      },
      "telephone": null,
      "services": [],
      "logo_enabled": false,
      "disabled": false,
      "user_ids": [
        16,
        15
      ]
    },
    {
      "id": 2,
      "unique_id": "agency_test003",
      "agency_code": "a00052",
      "order": 5,
      "name": {
        "en": "Nationality",
        "fr": "",
        "ar": "",
        "ar-LB": "",
        "so": "",
        "es": "Nacionalidad",
        "bn": ""
      },
      "description": {
        "en": "Nationality",
        "fr": "",
        "ar": "",
        "ar-LB": "",
        "so": "",
        "es": "Nacionalidad",
        "bn": ""
      },
      "telephone": "87452168",
      "services": [
        "services00"
      ],
      "logo_enabled": true,
      "disabled": true,
      "user_ids": []
    }
  ]
}
```
## Error Response

**Condition** : User isn't authorized to query for agencies.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/agencies",
      "message": "Forbidden"
    }
  ]
}
```
