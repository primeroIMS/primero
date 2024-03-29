<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->

# Save Primero configuration state

Saves off the current configuration state of Primero. This includes Forms, Fields, Lookups, Agencies, Roles, User Groups, and Reports.

**URL** : `/api/v2/configurations`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to manage Primero configurations.

**Parameters** :

* `data` A JSON describing the configuration state.
```json
{
  "data": {
    "name": "SWIMS - 20200903",
    "description": "September 2020 baseline"
  }
}
```
* `data["name"]` Optional. A short string label.
* `data["description"]` Optional. A longer string description.
* `data["version"]` Optional. This must be a unique field. If not specified a unique id will be generated by the server.
* `data["data"]` Optional. JSON config data. If passed in, it will store this instead of the current system configuration.

## Success Response

**Condition** : The current Primero configuration state is fully configured. Configurations will not save if the initials seeds have not run.

**Code** : `200 OK`

**Content** :

Additional fields will be populated by the server wghen a new configuratuin state is created.

```json
{
  "data": {
    "id": "ac3d041c-1592-4f99-8191-b38fbe448735",
    "name": "SWIMS - 20200903",
    "description": "September 2020 baseline",
    "version": "20200826.113513.25bf89a",
    "created_on": "2020-08-26T15:35:13.720Z",
    "created_by": 'primero_swims_admin',
    "applied_on": null,
    "applied_by": null
  }
}
```

---

**Condition** : User isn't authorized to manage configurations.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/configurations",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : The passed in configuration data is not valid.

**Code** : `422 Unprocessable Entity`

**Content** :

```json
{
  "errors": [
    {
      "code": 422,
      "resource": "/api/v2/configurations",
      "message": "errors.models.configuration.data",
      "detail": "data"
    }
  ]
}
```
