# Query for permissions

It returns all the available permissions for each resource.

**URL** : `/api/v2/permissions`

**Method** : `GET`

**Authentication** : YES

**Authorization** : None

**Parameters** : No parameters

## Success Response

**Condition** : A logged in user.

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
