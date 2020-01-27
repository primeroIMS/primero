# Update an existing user_group

Merge the values submitted in this call into an existing user_group.

**URL** : `/api/v2/user_groups/:id`

**Method** : `PATCH`

**Authentication** : YES

**Authorization** : The user must be authorized to edit user_groups in Primero.

**Parameters** :

* `data` A JSON representation of the user_group fields that will be updated.

```json
{
  "data":{
    "id": 1,
    "unique_id": "test_unique_id00",
    "core_resource": true
  }
}
```

## Success Response

**Condition** : User can update user_groups.

**Code** : `200 OK`

**Content** : A JSON representation of the user_group that has been updated.

```json
{
  "data": {
    "id": 1,
    "unique_id": "test_unique_id00",
    "name": "test_name00",
    "description": "test_description00",
    "core_resource": true
  }
}
```

## Error Response

**Condition** : User isn't authorized to update user_groups.

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

---

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

---