# Query for tasks

Show a paginated list of all tasks that are accessible to this user.

**URL** : `/api/v2/tasks`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view tasks in Primero. 

**Parameters** : 

* `page` Optional. Pagination. Defaults to 1
* `per` Optional. Tasks per page. Defaults to 20. 

## Success Response

**Condition** : User can see one or more tasks. 

**Code** : `200 OK`

**Content** :

```json
{
  "data": [
    {
      "record_type": "case",
      "record_id": "0eaddc20-7dbd-4b7a-8e08-29666fbb4769",
      "completion_field": "service_implemented_day_time",
      "detail": "service_1",
      "due_date": "06-Feb-2020",
      "id": "1e23781f-df19-4f97-8b65-e30fad55594e",
      "module_unique_id": "primeromodule-cp",
      "name": "Name 1",
      "overdue": true,
      "priority": "medium",
      "record_id_display": "6f5a4ff",
      "type": "service",
      "type_display": "Service 1",
      "upcoming_soon": false
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

**Condition** : User isn't authorized to query for tasks. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/tasks",
      "message": "Forbidden"
    }
  ]
}
```
