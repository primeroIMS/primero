# Fetch the individual location

Show the JSON representation of a location.

**URL** : `/api/v2/locations/:id`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view locations in Primero.

**Parameters** :

## Success Response

**Condition** : User can view this location.

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "id": 2,
    "code": "D01",
    "type": "departament",
    "name": {
      "ar": "",
      "bn": "",
      "en": "country_en::departament_en",
      "es": "country_es::departament_es",
      "fr": "",
      "so": "",
      "ar-LB": ""
    },
    "admin_level": 1,
    "placename": {
      "en": "departament_en",
      "fr": "",
      "ar": "",
      "ar-LB": "",
      "so": "",
      "es": "departament_es",
      "bn": ""
    },
    "hierarchy": [
      "CT01"
    ]
  }
}
```

## Error Response

**Condition** : User isn't authorized to view this location.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/locations/100",
      "message": "Forbidden"
    }
  ]
}
```

**Condition** : A location with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "status": 404,
      "resource": "/api/v2/locations/200",
      "message": "Not Found"
    }
  ]
}
```