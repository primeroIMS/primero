# Create a new form

Create a new form

**URL** : `/api/v2/forms`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to create forms in Primero.

**Parameters** : 

* `data` A JSON representation of the forms to be created.
```json
{
  "data": {
      "unique_id": "form_section_1",
      "name": {
        "en": "Form Section 1"
      },
      "fields": [
        {
          "name": "field_1",
          "display_name": {
            "en": "Field 1"
          }
        }
      ]
    }
}
```

## Success Response

**Condition** : User can create forms. 
No `id` attribute is provided in the `data` hash.

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
      "unique_id": "form_section_1",
      "name": {
        "en": "Form Section 1"
      },
      "fields": [
        {
          "name": "field_1",
          "display_name": {
            "en": "Field 1"
          }
        }
      ]
    }
}
```

---

**Condition** : User can create forms.
A client generated `id` attribute is provided in the `data` hash. 
This can be used to minimize the amount of data exchanged for low bandwidth scenarios.

**Code** : `204 No Content`

**Content** : The response has no content.

## Error Response

**Condition** : User isn't authorized to create forms. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/cases",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : A form with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/forms/10",
      "message": "Not Found"
    }
  ]
}
```

---

**Condition** : A form with the provided id already exists in the database.

**Code** : `409 Conflict`

**Content** :

```json
{
  "errors": [
    {
      "code": 409,
      "resource": "/api/v2/forms",
      "message": "Conflict"
    }
  ]
}
```

---

**Condition** : The form parameters would create an invalid case.

**Code** : `422 Unprocessable Entity`

**Content** :

```json
{
  "errors": [
    {
      "code": 422,
      "resource": "/api/v2/forms",
      "message": "errors.models.form_section.unique_id",
      "detail": "unique_id"
    }
  ]
}
```
