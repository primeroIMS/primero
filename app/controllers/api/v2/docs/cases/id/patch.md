# Update an existing case

Create a new case and optionally return the entire case, 
including attributes generated on the server.

**URL** : `/api/v2/cases/:id`

**Method** : `PATCH`

**Authentication** : YES

**Authorization** : The user must be authorized to edit cases in Primero.
A user may only set the fields that this user is permitted to access. 

**Parameters** : 

* `data` A JSON representation of the record fields that will be updated.
```json
{
  "data": {
      "age": 16,
      "sex": "female",
      "name": "Edwine Edgemont"
    }
}
```
* `append_to` Optional. A comma separated list of nested form field names that should be appended to rather than replaced.

## Success Response

**Condition** : User can update cases.   

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

## Error Response

**Condition** : User isn't authorized to create cases. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/cases/b3222e84-a5d7-4692-a643-1ab3d41f17d6",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : A case with the provided id doesn't exist in the database.. 

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/cases/b3222e84-a5d7-4692-a643-1ab3d41f17d6",
      "message": "Not Found"
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