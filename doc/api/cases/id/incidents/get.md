# Query incidents for a case

Show a list of all incidents associated with this user.

**URL** : `/api/v2/cases/:id/incidents`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view this case in Primero and to view incidents.

**Parameters** :

 `fields` Optional. A comma-separated list of fields that will be returned in the json data.
If unspecified this displays all permitted fields. The special value `short` will return a condensed
list of relevant permitted fields.

## Success Response

**Condition** : User can see this case and can view incidents.

**Code** : `200 OK`

**Content** :

```json
{
  "data": [
    {
      "id": "11d8ef93-1b48-4469-9dce-ab173f6c90f2",
      "enabled": true,
      "age": 5,
      "sex": "male",
      "status": "open",
      "created_at": "2020-08-05T16:06:37.696Z",
      "description": "Test 1",
      "incident_date": "2019-03-01"
    },
    {
      "id": "46255137-6e66-486d-b809-e1b825e840a8",
      "enabled": true,
      "age": 5,
      "sex": "male",
      "status": "open",
      "created_at": "2020-08-05T16:06:37.717Z",
      "description": "Test 2",
      "incident_date": "2019-08-01"
    }
  ]
}
```
## Error Response

**Condition** : User isn't authorized to access this case or incidents.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/cases/:id/incidents",
      "message": "Forbidden"
    }
  ]
}
```
