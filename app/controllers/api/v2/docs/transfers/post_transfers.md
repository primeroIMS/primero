# Bulk transfer

Initiate the transfer of cases in bulk to a single user.

**URL** : `/api/v2/cases/transfers`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to transfer each individual record.

**Parameters** : 

* `data` A JSON representation of the transfer.
```json
{
  "data": {
      "ids": ["749e9c6e-60db-45ec-8f5a-69da7c223a79", "dcea6052-07d9-4cfa-9abf-9a36987cdd25"],
      "transitioned_to": "primero_cp",
      "notes": "This is a bulk transfer"
    }
}
```

## Success Response

**Code** : `200 OK`

**Condition** : User is authorized to transfer, 
and the `transitioned_to` user is authorized to receive transfers. 

**Content** : The created transfer records.

```json
{
    "data": [
        {
            "id": "749e9c6e-60db-45ec-8f5a-69da7c223a79",
            "type": "Transfer",
            "record_id": "437189fc-cd1c-46ee-8d56-2891fc73605f",
            "record_type": "Child",
            "status": "inprogress",
            "transitioned_to": "primero_cp",
            "transitioned_by": "primero",
            "notes": "This is a bulk transfer",
            "created_at": "2019-09-16T18:37:16.078Z"
        },
        {
            "id": "dcea6052-07d9-4cfa-9abf-9a36987cdd25",
            "type": "Transfer",
            "record_id": "437189fc-cd1c-46ee-8d56-2891fc73605f",
            "record_type": "Child",
            "status": "inprogress",
            "transitioned_to": "primero_cp",
            "transitioned_by": "primero",
            "notes": "This is a bulk transfer",
            "created_at": "2019-09-16T18:37:16.078Z"
        }
    ]
}

```

## Error Response

**Condition** : User isn't authorized to transfer. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "status": 403,
      "resource": "/api/v2/cases/transfers",
      "message": "Forbidden"
    }
  ]
}
```