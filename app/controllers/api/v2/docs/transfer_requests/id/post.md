# Request record transfer

Request the transfer of an individual case to a single user.

**URL** : `/api/v2/cases/:id/transfer_requests`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to make transfer requests.

**Parameters** : 

* `data` A JSON representation of the transfer. Only the `notes` field is used.
```json
{
  "data": {
      "notes": "This is a transfer"
    }
}
```

## Success Response

**Code** : `200 OK`

**Condition** : User is authorized to make transfer requests. 


**Content** : The created transfer request record.

```json
{
    "data": {
        "id": "749e9c6e-60db-45ec-8f5a-69da7c223a79",
        "type": "TransferRequest",
        "record_id": "437189fc-cd1c-46ee-8d56-2891fc73605f",
        "record_type": "Child",
        "status": "inprogress",
        "transitioned_to": "primero_cp",
        "transitioned_by": "primero",
        "notes": "This is a transfer request",
        "created_at": "2019-09-16T18:37:16.078Z"
    }
}

```

## Error Response

**Condition** : User isn't authorized to make transfer requests. 

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