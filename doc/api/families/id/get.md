# Fetch the individual family

Show the JSON representation of a family. 

**URL** : `/api/v2/families/:id`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view families in Primero.

**Parameters** : 


## Success Response

**Condition** : User can view this family. 

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
    "family_number": "318e0925",
    "last_updated_at": "2022-02-04T21:43:13.561Z",
    "associated_user_names": [],
    "record_in_scope": true,
    "alert_count": 0
  },
}

```
## Error Response

**Condition** : User isn't authorized to view this family. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/families/b3222e84-a5d7-4692-a643-1ab3d41f17d6",
      "message": "Forbidden"
    }
  ]
}

```
**Condition** : A family with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/families/b3222e84-a5d7-4692-a643-1ab3d41f17d6",
      "message": "Not Found"
    }
  ]
}

```
