# Remove a file from a record

Remove a file from a record. The file will be irretrievably lost.

**URL** : `/api/v2/:recordType/:recordId/attachments/:id`

**Method** : `DELETE`

**Authentication** : YES

**Authorization** : The user must be authorized to update the record.

**Parameters** : 

## Success Response

**Code** : `204 OK`

## Error Response

**Condition** : User isn't authorized to update record. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "status": 403,
      "resource": "/api/v2/cases/attachments",
      "message": "Forbidden"
    }
  ]
}
```