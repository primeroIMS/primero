# Query for user_groups

Shows a paginated list of all user_groups that are accessible to this user.

**URL** : `/api/v2/user_groups`

**Method** : `GET`

**Authentication** : YES

**Authorization** :The user must be authorized to view user_groups in Primero.

**Parameters** :

* `page` Optional. Pagination. Defaults to 1
* `per` Optional. Records per page. Defaults to 20.

## Success Response

**Condition** : User can see one or more user_groups.

**Code** : `200 OK`

**Content** :

```json
{
  "data": [
    {
      "id": 4,
      "unique_id": "test_unique_id21",
      "name": "test_nam12",
      "description": "test_descriptio1n2",
      "core_resource": true
    },
    {
      "id": 6,
      "unique_id": "test_unique_id23",
      "name": "test_nam12",
      "description": "test_descriptio1n2",
      "core_resource": true
    }
  ]
}
```
## Error Response

**Condition** : User isn't authorized to query for user_groups.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/user_groups",
      "message": "Forbidden"
    }
  ]
}
```
