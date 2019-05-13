# Create a new case

Create a new case and optionally return the entire case, 
including attributes generated on the server.

**URL** : `/api/v2/cases/:id`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to edit cases in Primero.
A user may only set the fields that this user is permitted to access. 

**Parameters** : 

```json
{
  "data": {
      "age": 16,
      "sex": "female",
      "name": "Edwine Edgemont"
    }
}

```

## Success Response

**Condition** : User can create cases. 
No `id` attribute is provided in the `data` hash.    

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
      "age": 16,
      "sex": "female",
      "name": "Edwine Edgemont",
      "owned_by": "primero",
      "created_at": "2019-05-10T05:34:59.514Z",
      "case_id_display": "f15a1a9",
      "registration_date": "2019-05-10"
    }
}

```

---

**Condition** : User can create cases 
A client generated `id` attribute is provided in the `data` hash. 
This can be used to minimize the amount of data exchanged for low bandwidth scenarios.

**Code** : `204 No Content`

**Content** : The response has no content.

## Error Response

**Condition** : User isn't authorized to create cases. 

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

**Condition** : A case with thie provided id doesn't exist in the database.. 

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/cases/b3222e84-a5d7-4692-a643-1ab3d41f17d6",
      "message": "Please enter the date in a valid format (dd-mmm-yyyy)"
    }
  ]
}

```

---

**Condition** : A case with the provided id already exists in the database.

**Code** : `409 Conflict`

**Content** :

```json
{
  "errors": [
    {
      "code": 409,
      "resource": "/api/v2/cases",
      "message": "Conflict"
    }
  ]
}

```

---

**Condition** : The case parameters would create an invalid case.

**Code** : `422 Unprocessable Entity`

**Content** :

```json
{
  "errors": [
    {
      "code": 422,
      "resource": "/api/v2/cases",
      "message": "Please enter the date in a valid format (dd-mmm-yyyy)",
      "detail": "registration_date"
    }
  ]
}

```