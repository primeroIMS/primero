# Create a new agency

Create a new agency and return the entire record.

**URL** : `/api/v2/agencies`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to create agencies in Primero.

**Parameters** :

* `data` A JSON representation of the agency to be created.
```json
{
  "data": {
    "unique_id": "agency_test003",
    "agency_code": "a00052",
    "order": 5,
    "telephone": "87452168",
    "services": ["services00"],
    "logo_enabled": true,
    "disabled": true,
    "name": {
      "en": "Nationality",
      "es": "Nacionalidad"
    },
    "description": {
      "en": "Nationality",
      "es": "Nacionalidad"
    }
  }
}
```
* `data["id"]` Optional. A primary key identifier for the agency to be created.
Must be formatted as a Integer.

## Success Response

**Condition** : User can create agency.
No `id` attribute is provided in the `data` hash.

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "id": 1,
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
}
```

---

**Condition** : An agency with the id already exists in the database.

**Code** : `409 Conflict`

**Content** :

```json
{
  "errors": [
    {
      "code": 409,
      "resource": "/api/v2/agencies",
      "message": "Conflict"
    }
  ]
}
```

---

**Condition** : An agency without the uniq_id and agency_code.

**Code** : `422 Unprocessable Entity`

**Content** :

```json
{
  "errors"=>
  [
    {
      "status"=>422,
      "resource"=>"/api/v2/agencies",
      "detail"=>"unique_id",
      "message"=>["can't be blank"]
    },
    {
      "status"=>422,
      "resource"=>"/api/v2/agencies",
      "detail"=>"agency_code",
      "message"=>["errors.models.agency.code_present"]
    }
  ]
}
```

---

**Condition** : User isn't authorized to create agencies.

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

---