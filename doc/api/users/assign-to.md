# Query for assignment users

Shows a list of all users that this user can assign records to.

**URL** : `/api/v2/users/assign-to`

**Method** : `GET`

**Authentication** : YES

**Authorization**: The user must be authorized to perform assignments.

**Parameters** : 

* `record_type` Required. Users that can receive assignment or records of this type.


## Success Response

**Condition** : User is authorized.

**Code** : `200 OK`

**Content** :

```json
{
    "data": [
      {
        "id": 1,
        "full_name": "System Superuser",
        "user_name": "primero",
        "position": "System Administrator"
      }
     ]
}
```
## Error Response

**Condition** : User isn't authorized to assign records of this type.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/users/assign-to",
      "message": "Forbidden"
    }
  ]
}
```