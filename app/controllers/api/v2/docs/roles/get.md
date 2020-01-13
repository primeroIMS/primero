# Query for roles

Shows a paginated list of all roles that are accessible to this user.

**URL** : `/api/v2/roles`

**Method** : `GET`

**Authentication** : YES

**Authorization** :The user must be authorized to view roles in Primero.

**Parameters** :

* `page` Optional. Pagination. Defaults to 1
* `per` Optional. Records per page. Defaults to 20.

## Success Response

**Condition** : User can see one or more roles.

**Code** : `200 OK`

**Content** :

```json
{
  "data": [
    {
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
        },
        {
          "resource": "role",
          "actions": [
            "read",
            "write"
          ],
          "role_ids": [
            "role-cp-case-worker",
            "role-cp-manager",
          ]
        }
      ]
    },
    {
      "id": 2,
      "unique_id": "role-cp-case-worker",
      "name": "CP Case Worker",
      "description": null,
      "group_permission": "self",
      "referral": false,
      "transfer": false,
      "is_manager": false,
      "permissions": [
        {
          "resource": "case",
          "actions": [
            "read",
            "write",
          ]
        },
        {
          "resource": "incident",
          "actions": [
            "read",
            "write",
            "create"
          ]
        }
      ]
    }
  ]
}
```
## Error Response

**Condition** : User isn't authorized to query for roles.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/roles",
      "message": "Forbidden"
    }
  ]
}
```
