# Create a new lookup

Create a new lookup and optionally return the entire case.


**URL** : `/api/v2/lookups`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to edit lookups in Primero.

**Parameters** :

* `data` A JSON representation of the lookup to be created.
```json
{
  "data": {
    "unique_id": "lookup-nationality",
    "name": {
        "en": "Nationality",
    },
    "values": {
      "en": [
        {
            "id": "nationality1",
            "display_text": "Nationality1"
        }
      ]
    }
  }
}
```
* `data["id"]` Optional. A primary key identifier for the lookup to be created.
Must be formatted as a Integer.

## Success Response

**Condition** : User can create lookups.
No `id` attribute is provided in the `data` hash.

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "id": 1,
    "unique_id": "lookup-nationality",
    "name": {
        "en": "Nationality"
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
  }
}
```

---

**Condition** : User can create lookups
A client generated `id` attribute is provided in the `data` hash.
This can be used to minimize the amount of data exchanged for low bandwidth scenarios.

**Code** : `204 No Content`

**Content** : The response has no content.

## Error Response

**Condition** : User isn't authorized to create lookups.

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

---

**Condition** : A lookup with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/lookup/100",
      "message": "Not Found"
    }
  ]
}
```

---

**Condition** : A lookup with the provided id already exists in the database.

**Code** : `409 Conflict`

**Content** :

```json
{
  "errors": [
    {
      "code": 409,
      "resource": "/api/v2/lookups",
      "message": "Conflict"
    }
  ]
}
```

---

**Condition** : The lookup parameters would create an invalid case.

**Code** : `422 Unprocessable Entity`

**Content** :

```json
{
  "errors": [
    {
      "code": 422,
      "resource": "/api/v2/lookups",
      "message": "Name must not be blank",
      "detail": "name"
    }
  ]
}
```