# Create a new saved searches

Create a new saved search and optionally return the entire the saved searches.

**URL** : `/api/v2/saved_searches`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to create saved searches in Primero.

**Parameters** :

* `data` A JSON representation of the saved search to be created.

```json
{
    "data": {
        "name": "a new filter",
        "record_type": "case",
        "module_ids": ["primeromodule-cp", "primeromodule-gbv"],
        "filters": [
          {
            "name": "flag",
            "value": [
                "single",
                "flag"
            ]
          }
        ]
    }
}
```

* `data["id"]` Optional. A client-generated primary key identifier for the saved search to be created.

## Success Response

**Condition** : User can create saved search.
No `id` attribute is provided in the `data` hash.

**Code** : `200 OK`

**Content** :

```json
{
    "data": {
        "id": 1,
        "name": "a new filter",
        "module_ids": [
            "primeromodule-cp",
            "primeromodule-gbv"
        ],
        "record_type": "case",
        "user_name": "primero",
        "filters": [
          {
            "name": "flag",
            "value": [
                "single",
                "flag"
            ]
          }
        ]
    }
}
```

---

**Condition** : User can create saved search
A client generated `id` attribute is provided in the `data` hash.
This can be used to minimize the amount of data exchanged for low bandwidth scenarios.

**Code** : `204 No Content`

**Content** : The response has no content.

## Error Response

**Condition** : User isn't authorized to create saved search.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/saved_searches",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : A saved search with the provided id already exists in the database.

**Code** : `409 Conflict`

**Content** :

```json
{
  "errors": [
    {
      "code": 409,
      "resource": "/api/v2/saved_searches",
      "message": "Conflict"
    }
  ]
}
```
