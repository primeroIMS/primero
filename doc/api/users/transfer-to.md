<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->

# Query for transfer users

Shows a list of all users that this user can transfer records to.

**URL** : `/api/v2/users/transfer-to`

**Method** : `GET`

**Authentication** : YES

**Authorization**: The user must be authorized to perform transfers.

**Parameters** : 

* `record_type` Required. Users that can receive assignment or records of this type.
* `agency` Optional. Filters users by agency.
* `location` Optional. Filters users by location(reporting location of the user).


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

**Condition** : User isn't authorized to transfer records of this type. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/users/transfer-to",
      "message": "Forbidden"
    }
  ]
}
```