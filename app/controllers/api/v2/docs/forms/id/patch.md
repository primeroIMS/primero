# Update an existing form

Merge the values submitted in this call into an existing form. Fields in the request will be merged with the existing fields. Fields not specified in this request will be deleted. 

i18n fields will be updated only if the specific locale is part of the request.


**URL** : `/api/v2/forms/:id`

**Method** : `PATCH`

**Authentication** : YES

**Authorization** : The user must be authorized to edit forms in Primero.

**Parameters** : 

* `data` A JSON representation of the form that will be updated.
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

**Condition** : User can update forms.

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
      "id": 10,
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

## Error Response

**Condition** : User isn't authorized to update forms. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/forms/10",
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
