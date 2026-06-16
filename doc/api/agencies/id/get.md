# Fetch the individual agency

Show the JSON representation of an agency.

**URL** : `/api/v2/agencies/:id`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view an agency in Primero.

**Parameters** :

## Success Response

**Condition** : User can view this agency.

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
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
    "disabled": false
  }
}
```
## Error Response

**Condition** : User isn't authorized to view this agency.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/agencies/100",
      "message": "Forbidden"
    }
  ]
}

```
**Condition** : An agency with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/agencies/thisdoesntexist",
      "message": "Not Found"
    }
  ]
}

```
