# Query for record histories

Shows a paginated list of all record histories that are accessible to this user.

**URL** : `/api/v2/:record_type/:record_id/record_history`

**Method** : `GET`

**Authentication** : YES

**Authorization** :The user must be authorized to read and audit log the record in Primero.

**Parameters** :

* `page` Optional. Pagination. Defaults to 1
* `per` Optional. Records per page. Defaults to 20.

## Success Response

**Condition** : User can see one or more record histories from a specific record.

**Code** : `200 OK`

**Content** :

```json
{
  "data": [
    {
      "record_id": "51cc422b-4570-4c5a-a8ee-15a32db52199",
      "record_type": "Child",
      "datetime": "2020-04-15T17:18:58Z",
      "user_name": "primero",
      "action": "update",
        "record_changes": [
          {
            "name": {
              "to": "Test 2 Test 2 Test 2",
              "from": "Test 1 Test 1"
            }
          },
          {
            "name_last": {
              "to": "Test 2",
              "from": "Test 1"
            }
          }
        ]
      },
    {
      "record_id": "51cc422b-4570-4c5a-a8ee-15a32db52199",
      "record_type": "Child",
      "datetime": "2020-04-15T17:18:39Z",
      "user_name": "primero",
      "action": "create",
      "record_changes": []
    }
  ],
  "metadata": {
    "total": 2,
    "per": 20,
    "page": 1
  }
}
```

## Error Response

**Condition** : User isn't authorized to query for record histories.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/cases/51cc422b-4570-4c5a-a8ee-15a32db52199/record_history",
      "message": "Forbidden"
    }
  ]
}
```
