# Fetch the individual lookup

Show the JSON representation of a lookup.

**URL** : `/api/v2/lookups/:id`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view lookups in Primero.

**Parameters** :

## Success Response

**Condition** : User can view this lookup.

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
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
      },
      {
      "id": "nationality2",
      "display_text": {
        "en": "Nationality2",
        "fr": "",
        "es": ""
        }
      }
    ]
  }
}

```
## Error Response

**Condition** : User isn't authorized to view this lookup.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/lookups/100",
      "message": "Forbidden"
    }
  ]
}

```
**Condition** : A lookup with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/lookups/200",
      "message": "Not Found"
    }
  ]
}

```
