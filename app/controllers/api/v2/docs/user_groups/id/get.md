# Fetch the individual user_group

Show the JSON representation of a user_group.

**URL** : `/api/v2/user_groups/:id`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view a user_group in Primero.

**Parameters** :

## Success Response

**Condition** : User can view this user_group.

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "id": 2,
    "unique_id": "usergroup-primero-ftr",
    "name": "Primero FTR",
    "description": "Default Primero User Group for FTR",
    "core_resource": false,
    "user_ids": [
      1,
      7
    ]
  }
}
```
## Error Response

**Condition** : User isn't authorized to view this user_group.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/user_groups/100",
      "message": "Forbidden"
    }
  ]
}

```
**Condition** : A user_group with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/user_groups/thisdoesntexist",
      "message": "Not Found"
    }
  ]
}

```
