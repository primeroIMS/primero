# Revoke or relinquish a referral

The user will lose access to this case.

**URL** : `/api/v2/cases/:id/referrals/:referral_id`

**Method** : `DELETE`

**Authentication** : YES

**Authorization** : The user must be authorized to edit the record.

**Parameters** : None

## Success Response

**Code** : `200 OK`

**Condition** : User is authorized to edit this record. 

**Content** : The referral record, with updated status

```json
{
    "data": {
        "id": "749e9c6e-60db-45ec-8f5a-69da7c223a79",
        "type": "Referral",
        "status": "done",
        "record_id": "437189fc-cd1c-46ee-8d56-2891fc73605f",
        "record_type": "Child",
        "transitioned_to": "primero_cp",
        "transitioned_by": "primero",
        "notes": "This is a referral",
        "created_at": "2019-09-16T18:37:16.078Z"
    }
}

```

## Error Response

**Condition** : User isn't authorized to refer. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "status": 403,
      "resource": "/api/v2/cases/referrals",
      "message": "Forbidden"
    }
  ]
}
```