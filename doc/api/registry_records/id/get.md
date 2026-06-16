# Fetch the individual registry record

Show the JSON representation of a registry. 

**URL** : `/api/v2/registry_records/:id`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view registry records in Primero.

**Parameters** : 


## Success Response

**Condition** : User can view this registry record. 

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "id": "317e0667-e5ec-4c28-a9bc-e60ceb311168",
    "enabled": true,
    "status": "open",
    "short_id": "62bdf5f",
    "created_at": "2022-02-04T21:43:13.561Z",
    "record_state": true,
    "registry_type": "farmer",
    "last_updated_at": "2022-02-04T21:43:13.561Z",
    "associated_user_names": [],
    "record_in_scope": true,
    "alert_count": 0
  },
}

```
## Error Response

**Condition** : User isn't authorized to view this registry record. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/registry_records/b3222e84-a5d7-4692-a643-1ab3d41f17d6",
      "message": "Forbidden"
    }
  ]
}

```
**Condition** : A registry record with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/registry_records/b3222e84-a5d7-4692-a643-1ab3d41f17d6",
      "message": "Not Found"
    }
  ]
}

```
