# Create a new location

Create a new location and return the entire record.

**URL** : `/api/v2/locations`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to edit locations in Primero.

**Parameters** :

* `data` A JSON representation of the location to be created.
```json
{
  "data": {
    "code": "D01",
    "type": "departament",
    "placename": {
      "en": "departament_en",
      "es": "departament_es"
    },
    "parent_code": "CT01"
  }
}
```

## Success Response

**Condition** : User can create locations.

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "id": 2,
    "code": "D01",
    "type": "departament",
    "name": {
      "en": "country_en::departament_en",
      "fr": "",
      "ar": "",
      "ar-LB": "",
      "so": "",
      "es": "country_es::departament_es",
      "bn": ""
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

**Condition** : User isn't authorized to create locations.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/locations",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : A locations with the location code already exists in the database.

**Code** : `422`

**Content** :

```json
{
  "errors": [
    {
      "status": 422,
      "resource": "/api/v2/locations",
      "detail": "location_code",
      "message": [
        "A Location with that location code already exists, please enter a different location code"
      ]
    }
  ]
}
```

---

**Condition** : A locations with the location code blank.

**Code** : `422`

**Content** :

```json
{
  "errors": [
    {
      "status": 422,
      "resource": "/api/v2/locations",
      "detail": "location_code",
      "message": [
        "must not be blank"
      ]
    }
  ]
}
```
---

**Condition** : A parent locations without admin level.

**Code** : `422`

**Content** :

```json
{
  "errors": [
    {
      "status": 422,
      "resource": "/api/v2/locations",
      "detail": "admin_level",
      "message": [
        "must not be blank"
      ]
    }
  ]
}
```