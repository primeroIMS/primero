# Refer record

Refer an individual case to a single user.

**URL** : `/api/v2/cases/:id/referrals`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to refer the record.

**Parameters** : 

* `data` A JSON representation of the referral.
```json
{
  "data": {
      "to_user_name": "primero_cp",
      "notes": "This is a referral"
    }
}
```

## Success Response

**Code** : `200 OK`

**Condition** : User is authorized to refer, 
and the `to_user_name` user is authorized to receive referrals. 


**Content** : The created referral records.

```json
{
    "data": {
        "id": "749e9c6e-60db-45ec-8f5a-69da7c223a79",
        "type": "Referral",
        "record_id": "437189fc-cd1c-46ee-8d56-2891fc73605f",
        "record_type": "Child",
        "to_user_name": "primero_cp",
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