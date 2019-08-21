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
      "record_id_display": "0bdac29",
      "type": "service"
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
