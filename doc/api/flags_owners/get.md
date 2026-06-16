# Query for flag

Show a list of all flags for a user. The user can filter the form list by record type. 

**URL** : `/api/v2/flags`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to index flags in Primero.

**Parameters** :
 
* `record_type` Optional. Filters by the record type ('cases', 'incidents', or 'tracing_requests').
* `flagged_by_me` Optional. Filters by flagged_by
* `active_only` Optional. If true, filters by removed == false (meaning active flags)

## Success Response

**Condition** : User can see one or more flags.
If the user has Agency permission, it returns flags for all users in the same agency
If the user has Group permission, it returns flags for all users in associated groups
If the user has All permission, it returns all flags
Else, it returns flags for records owned by this user

**Code** : `200 OK`

**Content** :

```json
{
    "data": [
        {
            "id": 1,
            "record_id": "749e9c6e-60db-45ec-8f5a-69da7c223a79",
            "record_type": "cases",
            "date": "2019-08-01",
            "message": "This is a flag",
            "flagged_by": "primero",
            "removed": false,
            "unflag_message": null,
            "created_at": "2019-08-16T22:11:16.737Z",
            "system_generated_followup": false,
            "unflagged_by": null,
            "unflagged_date": null,
            "short_id": "27ccb64",
            "name": "*******",
            "hidden_name": true,
            "owned_by": "user1",
            "owned_by_agency_id": 1,
            "record_access_denied": false
        },
        {
            "id": 3,
            "record_id": "749e9c6e-60db-45ec-8f5a-69da7c223a79",
            "record_type": "cases",
            "date": "2019-08-01",
            "message": "This is a flag",
            "flagged_by": "primero",
            "removed": false,
            "unflag_message": null,
            "created_at": "2019-08-16T22:03:34.511Z",
            "system_generated_followup": false,
            "unflagged_by": null,
            "unflagged_date": null,
            "short_id": "27ccb64",
            "name": "Jane Doe",
            "hidden_name": false,
            "owned_by": "user1",
            "owned_by_agency_id": 1,
            "record_access_denied": false
        },
        {
          "id": 5,
          "record_id": "749e9c6e-60db-45ec-8f5a-69da7c223a79",
          "record_type": "cases",
          "date": "2020-06-22",
          "message": "Adding new flag",
          "flagged_by": "primero",
          "removed": true,
          "unflag_message": "Flag Resolved",
          "created_at": "2020-06-22T15:28:34.320Z",
          "system_generated_followup": false,
          "unflagged_by": "primero",
          "unflagged_date": "2020-06-24",
          "short_id": "27ccb64",
          "name": "*******",
          "hidden_name": true,
          "owned_by": "user1",
          "owned_by_agency_id": 1,
          "record_access_denied": false
        }
    ]
}
```
## Error Response

**Condition** : User isn't authorized to index flags.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/flags",
      "message": "Forbidden"
    }
  ]
}
```
