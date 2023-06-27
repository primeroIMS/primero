# Update an existing family

Merge the values submitted in this call into an existing family.

**URL** : `/api/v2/families/:id`

**Method** : `PATCH`

**Authentication** : YES

**Authorization** : The user must be authorized to edit families in Primero.

**Parameters** : 

* `data` A JSON representation of the record fields that will be updated.
```json
{
  "data": {
      "family_number": "8962e835"
    }
}
```

## Success Response

**Condition** : User can update families.

**Code** : `200 OK`

**Content** : A JSON representation of all fields that changed as a result of this update
that the user is allowed to view.

```json
{
  "data": {
      "family_number": "8962e835"
    }
}
```

## Error Response

**Condition** : User isn't authorized to update families. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/families/b3222e84-a5d7-4692-a643-1ab3d41f17d6",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : A family with the provided id doesn't exist in the database.. 

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/families/b3222e84-a5d7-4692-a643-1ab3d41f17d6",
      "message": "Not Found"
    }
  ]
}
```

---

**Condition** : The family parameters would create an invalid family.

**Code** : `422 Unprocessable Entity`

**Content** :

```json
{
  "errors": [
    {
      "code": 422,
      "resource": "/api/v2/families",
      "message": "Please enter a valid family number",
      "detail": "family_number"
    }
  ]
}
```