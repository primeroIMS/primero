# Attach a file to a record

Attach a file, encoded as base64, to a record

**URL** : `/api/v2/:recordType/:recordId/attachments`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to update the record and the declared `field_name`.

**Parameters** : 

* `data` A JSON representation of the attachment.
```json
{
  "data": {
     "field_name": "<name of field>",
     "type": "image|audio|document",
     "content_type": "application/pdf - optional but strongly recommended",
     "date": "<client date>",
     "description": "<text>",
     "is_current": true|false,
     "comments": "<text>",
     "attachment": "<base64encoded string>"
  }
}
```

## Success Response

**Code** : `200 OK`

**Content** : The attachment with the new internal url.

```json
{
    "data": {
      "id": "<int id>",
      "record_field_scope": "<name of field>",
      "date": "<client date>",
      "document_description": "<text>",
      "is_current": true|false,
      "comments": "text",
      "attachment_url": "activestorage url>",
      "record": {
         "id": "record idx"
      }
    }
}
```

## Error Response

**Condition** : User isn't authorized to update record or the declared `field_name`.

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