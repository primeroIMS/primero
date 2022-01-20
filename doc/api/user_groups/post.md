# Create a new user_group

Create a new user_group and return the entire record.

**URL** : `/api/v2/user_groups`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to create user_groups in Primero.

**Parameters** :

* `data` A JSON representation of the user_group to be created.
```json
{
  "data":{
    "unique_id": "test_unique_id 2",
    "name": "test_nam 2",
    "description": "test_description 2"
  }
}
```
* `data["id"]` Optional. A primary key identifier for the user_group to be created.
Must be formatted as a Integer.

## Success Response

**Condition** : User can create user_group.
No `id` attribute is provided in the `data` hash.

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "id": 15,
    "unique_id": "test_unique_id 2",
    "name": "test_nam 2",
    "description": "test_description 2",
    "core_resource": true
  }
}
```

---

**Condition** : A user_group with the uniq_id already exists in the database.

**Code** : `409 Conflict`

**Content** :

```json
{
  "errors": [
    {
      "code": 409,
      "resource": "/api/v2/user_groups",
      "message": "Conflict"
    }
  ]
}
```

---

**Condition** : User isn't authorized to create user_groups.

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

---