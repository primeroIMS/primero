# Query for audit_logs

Shows a paginated list of all audit_logs.

**URL** : `/api/v2/audit_logs`

**Method** : `GET`

**Authentication** : YES

**Authorization** :The user must be authorized to view audit_logs in Primero.

**Parameters** :

* `user_name` Optional.
* `timestamp[from]` Optional. ISO formatted: 2020-03-02T09:06:50-06:00.
* `timestamp[to]` Optional. ISO formatted: 2020-03-02T11:06:50-06:00.
* `page` Optional. Pagination. Defaults to 1
* `per` Optional. Records per page. Defaults to 100.

## Success Response

**Condition** : User can see one or more audit_logs.

**Code** : `200 OK`

**Content** :

```json
{
  "data": [
    {
      "id": 2,
      "display_id": "",
      "record_type": "AuditLog",
      "user_name": "primero",
      "action": "index",
      "resource_url": "http://localhost:3000/api/v2/audit_logs",
      "timestamp": "2020-03-03T16:40:39.387Z",
      "log_message": "Listing Records AuditLog '' by user 'primero'",
      "metadata": {
        "user_name": "primero"
      }
    },
    {
      "id": 1,
      "display_id": 1,
      "record_type": "User",
      "user_name": "primero",
      "action": "create",
      "resource_url": "http://localhost:3000/api/v2/tokens",
      "timestamp": "2020-03-03T16:40:37.370Z",
      "log_message": "Creating User '1' by user 'primero'",
      "metadata": {
        "user_name": "primero"
      }
    }
  ],
  "metadata": {
    "total": 2,
    "per": 100,
    "page": 1
  }
}
```
## Error Response

**Condition** : User isn't authorized to query for audit_logs.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/audit_logs",
      "message": "Forbidden"
    }
  ]
}
```
