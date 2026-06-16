# Create a new role

Create a new role and return the entire record.

**URL** : `/api/v2/roles`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to create roles in Primero.

**Parameters** :

* `data` A JSON representation of the role to be created.
```json
{
  "data": {
    "unique_id": "role-cp-administrator-00",
    "name": "CP Administrator 00",
    "description": "Administrator_description",
    "group_permission": "all",
    "module_unique_ids": [
      "primeromodule-cp",
      "primeromodule-gbv"
    ],
    "form_section_unique_ids": [
      "activities",
      "partner_details"
    ],
    "permissions": {
      "agency": [
        "read",
        "write"
      ],
      "role": [
        "read",
        "write"
      ],
      "objects": {
        "agency": [
          "role-cp-case-worker",
          "id_2"
        ],
        "role": [
          "role-cp-case-worker",
          "id_2"
        ]
      }
    }
  }
}
```
* `data["id"]` Optional. A primary key identifier for the role to be created.
Must be formatted as a Integer.

## Success Response

**Condition** : User can create role.
No `id` attribute is provided in the `data` hash.

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "id": 4,
    "unique_id": "role-cp-administrator-00",
    "name": "CP Administrator 00",
    "description": "Administrator_description",
    "group_permission": "all",
    "referral": false,
    "transfer": false,
    "is_manager": true,
    "module_unique_ids": [
      "primeromodule-cp",
      "primeromodule-gbv"
    ],
    "form_section_unique_ids": [
      "activities",
      "partner_details"
    ],
    "permissions": {
      "agency": [
        "read",
        "write"
      ],
      "role": [
        "read",
        "write"
      ],
      "objects": {
        "agency": [
          "role-cp-case-worker",
          "id_2"
        ],
        "role": [
          "role-cp-case-worker",
          "id_2"
        ]
      }
    }
  }
}
```

---

**Condition** : A role with the uniq_id already exists in the database.

**Code** : `409 Conflict`

**Content** :

```json
{
  "errors": [
    {
      "code": 409,
      "resource": "/api/v2/roles",
      "message": "Conflict"
    }
  ]
}
```

---

**Condition** : A role with the uniq_id already exists in the database.

**Code** : `409 Conflict`

**Content** :

```json
{
  "errors": [
    {
      "code": 409,
      "resource": "/api/v2/roles",
      "message": "Conflict"
    }
  ]
}
```

---

**Condition** : A role without permissions in the params.

**Code** : `422`

**Parameters** :

```json
{
  "data": {
    "unique_id": "role-cp-administrator-00",
    "name": "CP Administrator 00",
    "description": "Administrator_description",
    "group_permission": "all",
    "referral": false,
    "transfer": false,
    "is_manager": true,
    "permissions": null
  }
}
```

**Content** :

```json
{
  "errors": [
    {
      "code": 409,
      "resource": "/api/v2/roles",
      "message": "Please select at least one permission"
    }
  ]
}
```

---

**Condition** : User isn't authorized to create roles.

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

---