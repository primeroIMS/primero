# Apply the Configuration

Apply the saved Primero configuration state. This will replace the currently configured Forms, Fields, Lookups, and Reports with those in the configuration state, deleting the ones that are left over. Agencies, Roles, and UserGroups are updated according to this configuration state. If agencies, user groups, or roles were created after this configuration was generated, they will not be removed or modified.

**URL** : `/api/v2/configurations/:id`

**Method** : `PATCH`

**Authentication** : YES

**Authorization** : The user must be authorized to manage configurations.

**Parameters** :

* `data` A JSON with an action flag:
  * `apply_now` flag set to true will apply this configuration on the system.
  * `promote` flag set to true will invoke the configuration promotion Job to promote to an external API.

```json
{
  "data": {
    "apply_now": true
  }
}
```

## Success Response

**Code** : `200 OK`

**Content** : Show the JSON describing a saved Primero configuration state.
```json
{
  "data": {
    "id": "ac3d041c-1592-4f99-8191-b38fbe448735",
    "name": "SWIMS - 20200903",
    "description": "September 2020 baseline",
    "version": "20200826.113513.25bf89a",
    "created_on": "2020-08-26T15:35:13.720Z",
    "created_by": 'primero_swims_admin',
    "applied_on": "2020-09-13T18:44:13.659Z",
    "applied_by": 'primero_swims_admin'
  }
}
```

## Error Response

**Condition** : User isn't authorized to manage configurations.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/configurations/ac3d041c-1592-4f99-8191-b38fbe448735",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : A configuration with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/configurations/thisdoesntexist",
      "message": "Not Found"
    }
  ]
}
```
