# Fetch the individual role

Show the JSON representation of a role.

**URL** : `/api/v2/roles/:id`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view a role in Primero.

**Parameters** :

## Success Response

**Condition** : User can view this role.

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "id": 1,
    "unique_id": "role-cp-administrator",
    "name": "CP Administrator",
    "description": null,
    "group_permission": "all",
    "referral": false,
    "transfer": false,
    "is_manager": true,
    "permissions": [
      {
        "resource": "case",
        "actions": [
          "read",
          "write"
        ]
      }
    ]
  }
}
```
## Error Response

**Condition** : User isn't authorized to view this role.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/roles/100",
      "message": "Forbidden"
    }
  ]
}

```
**Condition** : A role with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/roles/thisdoesntexist",
      "message": "Not Found"
    }
  ]
}

```
