# Fetch the individual configuration

Show the JSON describing a saved Primero configuration state.

**URL** : `/api/v2/configurations/:id`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to manage configurations.

**Parameters** :

## Success Response

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "id": "ac3d041c-1592-4f99-8191-b38fbe448735",
    "name": "SWIMS - 20200903",
    "description": "September 2020 baseline",
    "version": "20200826.113513.25bf89a",
    "created_on": "2020-08-26T15:35:13.720Z",
    "created_by": 'primero_swims_admin',
    "applied_on": "2020-09-13T18:44:13.659Z",
    "applied_by": 'primero_swims_admin'
  }
}
```
## Error Response

**Condition** : User isn't authorized to manage configurations.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/configurations/ac3d041c-1592-4f99-8191-b38fbe448735",
      "message": "Forbidden"
    }
  ]
}

```
**Condition** : A configuration with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/configuration/thisdoesntexist",
      "message": "Not Found"
    }
  ]
}
```
