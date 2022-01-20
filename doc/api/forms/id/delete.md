# Disable an existing case

Deletes a form, the associated fields and the associated subforms.

**URL** : `/api/v2/forms/:id`

**Method** : `DELETE`

**Authentication** : YES

**Authorization** : The user must be authorized to delete forms in Primero. 

**Parameters** : No parameters 

## Success Response

**Condition** : User can delete forms.
The form is editable and all its fields are editable.

**Code** : `200 OK`

## Error Response

**Condition** : User isn't authorized to delete forms.

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
