<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->

# Query for activities

Shows a paginated list of activities that are accessible to this user.

**URL** : `/api/v2/activity_log`

**Method** : `GET`

**Authentication** : YES

**Authorization** :The user must be authorized to view activities in Primero.

**Parameters** :

* `page` Optional. Pagination. Defaults to 1
* `per` Optional. Records per page. Defaults to 20
* `order` Optional. Order activities. Defaults to desc
* `types` Optional. An array of activities to be returned. Defaults to all available activities.
Example: `types[]=transfer`
* `datetime` Optional. The date range for performed activities. Defaults to last week.
Example: `datetime[from]=2021-01-01T15:30:0Z&datetime[to]=2021-01-01T10:30:0Z`

## Success Response

**Condition** : User can see one or more activities.

**Code** : `200 OK`

**Content** :

```json
{
  "data": [
    {
      "type": "transfer",
      "record_type": "Child",
      "record_id": "5343c271-44ee-49a2-a10e-2e9c1e2397e6",
      "display_id": "52c376d",
      "performed_by": "primero_cp",
      "datetime": "2021-11-03T01:17:00.987Z",
      "record_access_denied": false,
      "data": {
        "status": {
          "from": "in_progress",
          "to": "accepted"
        },
        "owned_by": {
          "from": "primero_cp",
          "to": "primero_mgr_cp"
        }
      }
    }
  ]
}
```

## Error Response

**Condition** : User isn't authorized to query for activities.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/activity_log",
      "message": "Forbidden"
    }
  ]
}
```
