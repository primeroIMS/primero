# Accept or decline a transfer request

The user accepts a transfer rewuest and initiates a transfer or declines the request.

**URL** : `/api/v2/cases/:id/transfer_requests/:transfer_request_id`

**Method** : `PATCH`

**Authentication** : YES

**Authorization** : The user must be authorized to view the record.

**Parameters** : Set the `status` key to either `accepted` or `rejected`. 
All other values will be ignored.

```json
{
  "data": {
    "status": "accepted|rejected",
    "rejected_reason": "Rejected for reasons"
  }
}
```

## Success Response

**Code** : `200 OK`

**Condition** : User is authorized to view this record. 

**Content** : The transfer request record, with updated status

```json
{
    "data": {
        "id": "749e9c6e-60db-45ec-8f5a-69da7c223a79",
        "type": "TransferRequest",
        "status": "accepted",
        "record_id": "437189fc-cd1c-46ee-8d56-2891fc73605f",
        "record_type": "Child",
        "to_user_name": "primero_cp",
        "transitioned_by": "primero",
        "notes": "This is a transfer request",
        "created_at": "2019-09-16T18:37:16.078Z"
    }
}

```

## Error Response

**Condition** : User isn't authorized to view this record. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "status": 403,
      "resource": "/api/v2/cases/transfer_requests",
      "message": "Forbidden"
    }
  ]
}
```