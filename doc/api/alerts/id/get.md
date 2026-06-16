# Query for alert

Show a list of all alerts from a records. depends of the recordType and the record id.

**URL** : `/api/v2/:recordType/:recordId/alerts`

**Method** : `GET`

**Authentication** : YES

**Authorization** : All logged in users who can view this record are permitted to make this request.

**Parameters** : No parameters

## Success Response

**Condition** : User can see one or more alerts of a record.

**Code** : `200 OK`

**Content** :

```json
{
  "data": [
    {
      "alert_for": "transfer_request",
      "type": "transfer_request",
      "date": "29-Nov-2019",
      "form_unique_id": 0
    },
    {
      "alert_for": "transfer_request",
      "type": "transfer_request",
      "date": "29-Nov-2019",
      "form_unique_id": 0
    }
  ]
}
```
## Error Response


**Condition** : User isn't authorized to view this alert.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/cases/1/alerts",
      "message": "Forbidden"
    }
  ]
}
```

**Condition** : The record does not exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "status": 404,
      "resource": "/api/v2/cases/this-record-does-not-exist/alerts",
      "message": "Not Found"
    }
  ]
}
```
