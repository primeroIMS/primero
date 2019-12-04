# Update an existing location

Merge the values submitted in this call into an existing location.

**URL** : `/api/v2/locations/:id`

**Method** : `PATCH`

**Authentication** : YES

**Authorization** : The user must be authorized to edit locations in Primero.

**Parameters** :

* `data` A JSON representation of the location fields that will be updated.

```json
{
  "data": {
    "code": "D02",
    "type": "departament02",
    "placename": {
      "en": "departament02_en",
      "es": "departament02_es"
    },
    "parent_code": "CT01"
  }
}
```

## Success Response

**Condition** : User can update locations.

**Code** : `200 OK`

**Content** : A JSON representation of the location that has been updated.

```json
{
  "data": {
    "id": 2,
    "code": "D02",
    "type": "departament02",
    "name": {
      "ar": "",
      "bn": "",
      "en": "country_en::departament02_en",
      "es": "country_es::departament02_es",
      "fr": "",
      "so": "",
      "ar-LB": ""
    },
    "admin_level": 1,
    "placename": {
      "en": "departament02_en",
      "fr": "",
      "ar": "",
      "ar-LB": "",
      "so": "",
      "es": "departament02_es",
      "bn": ""
    },
    "hierarchy": [
      "CT01"
    ]
  }
}
```

## Error Response

**Condition** : User isn't authorized to update locations.

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

---

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
