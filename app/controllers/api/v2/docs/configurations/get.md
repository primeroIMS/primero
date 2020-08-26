# Query for saved configurations

Shows a paginated list of all configurations.

**URL** : `/api/v2/configurations`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to manage Primero configurations

**Parameters** :

* `page` Optional. Pagination. Defaults to 1
* `per` Optional. Records per page. Defaults to 20.

## Success Response

**Code** : `200 OK`

**Content** :

```json
{
  "data": [
    {
      "id": "ac3d041c-1592-4f99-8191-b38fbe448735",
      "name": "SWIMS - 20200903",
      "description": "September 2020 baseline",
      "version": "20200826.113513.25bf89a",
      "created_on": "2020-08-26T15:35:13.720Z",
      "created_by": 'primero_swims_admin',
      "applied_on": null,
      "applied_by": null
    }
  ],
  "metadata": {
    "total": 1,
    "per": 20,
    "page": 1
  }
}
```

## Error Response

**Condition** : User isn't authorized to query for configurations

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
