# Update an existing agency

Merge the values submitted in this call into an existing agency.

**URL** : `/api/v2/agencies/:id`

**Method** : `PATCH`

**Authentication** : YES

**Authorization** : The user must be authorized to edit agencies in Primero.

**Parameters** :

* `data` A JSON representation of the agency fields that will be updated.

```json
{
  "data": {
  "id": 2,
    "unique_id": "agency_test000",
    "agency_code": "a00500",
    "order": 500,
    "telephone": "8745216800",
    "services": ["services0000"],
    "logo_enabled": true,
    "disabled": true,
    "description": {
      "en": "Nationality"
    }
  }
}
```

## Success Response

**Condition** : User can update agencies.

**Code** : `200 OK`

**Content** : A JSON representation of the agency that has been updated.

```json
{
  "data": {
    "id": 2,
    "unique_id": "agency_test000",
    "agency_code": "a00500",
    "order": 500,
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
      "es": "",
      "bn": ""
    },
    "telephone": "8745216800",
    "services": [
      "services0000"
    ],
    "logo_enabled": true,
    "disabled": true
  }
}
```

## Error Response

**Condition** : User isn't authorized to update agencies.

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

---

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

---