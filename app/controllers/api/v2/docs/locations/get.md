# Query for locations

Shows a paginated list of all locations that are accessible to this user.

**URL** : `/api/v2/locations`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view locations in Primero.

**Parameters** :

* `page` Optional. hierarchy. Defaults to false

## Success Response with param hierarchy=true

**Condition** : User can see one or more locations.

**Code** : `200 OK`

**Content** :

```json
{
  "data": [
    {
      "id": 1,
      "code": "CT01",
      "type": "country",
      "name": {
        "ar": "",
        "bn": "",
        "en": "country_en",
        "es": "country_es",
        "fr": "",
        "so": "",
        "ar-LB": ""
      },
      "admin_level": 0,
      "placename": {
        "en": "country_en",
        "fr": "",
        "ar": "",
        "ar-LB": "",
        "so": "",
        "es": "country_es",
        "bn": ""
      },
      "hierarchy": []
    },
    {
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
      "admin_level": 2,
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
  ]
}
```

---

## Success Response with param hierarchy=false

**Condition** : User can see one or more locations.

**Code** : `200 OK`

**Content** :

```json
{
  "data": [
    {
      "id": 627,
      "code": "CT03",
      "type": "country4",
      "name": {
        "en": "country3_en",
        "fr": "",
        "ar": "",
        "ar-LB": "",
        "so": "",
        "es": "country3_es",
        "bn": ""
      }
    },
    {
      "id": 628,
      "code": "D01",
      "type": "departament",
      "name": {
        "en": "country3_en::departament_en",
        "fr": "",
        "ar": "",
        "ar-LB": "",
        "so": "",
        "es": "country3_es::departament_es",
        "bn": ""
      }
    }
  ]
}
```
## Error Response

**Condition** : User isn't authorized to query for locations.

**Code** : `403 Forbidden`

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