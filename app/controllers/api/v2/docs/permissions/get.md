# Query for permissions

It returns all the available permissions for each resource.

**URL** : `/api/v2/permissions`

**Method** : `GET`

**Authentication** : YES

**Authorization** : User needs to be authorized to write roles.

**Parameters** : No parameters

## Success Response

**Condition** : A logged user who can write roles.

**Content** :

```json
{
  "data": {
    "management": [
      "self",
      "group",
      "all",
      "admin_only"
    ],
    "resource_actions": {
      "case": ["read", "write"],
      "incident": ["read", "write"],
      "tracing_request": ["read", "write"]
    }
  }
}
```
## Error Response

**Condition** : User isn't authorized to list permissions

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/permissions",
      "message": "Forbidden"
    }
  ]
}
```