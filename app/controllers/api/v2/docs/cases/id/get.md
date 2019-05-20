# Fetch the individual case

Show the JSON representation of a case. 

**URL** : `/api/v2/cases/:id`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view cases in Primero. A user's ability to view this case
depends on the user's authorization scope: just cases the user is assigned to, cases that are associated with all 
users in this user's user groups, or all cases in the system. The fields that are shown for each case 
are only fields that this user is permitted to view. 

**Parameters** : 

* `fields` Optional. A comma-separated list of fields that will be returned in the json data. 
If unspecified this displays all permitted fields. The special value `short` will return a condensed
list of relevant permitted fields.

## Success Response

**Condition** : User can view this case. 

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
      "id": "b3222e84-a5d7-4692-a643-1ab3d41f17d6",
      "age": 16,
      "sex": "female",
      "name": "Edwine Edgemont",
      "owned_by": "primero",
      "created_at": "2019-05-10T05:34:59.514Z",
      "case_id_display": "f15a1a9",
      "registration_date": "2019-05-10"
  }
}

```
## Error Response

**Condition** : User isn't authorized to view this case. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/cases/b3222e84-a5d7-4692-a643-1ab3d41f17d6",
      "message": "Forbidden"
    }
  ]
}

```
**Condition** : A case with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/cases/b3222e84-a5d7-4692-a643-1ab3d41f17d6",
      "message": "Not Found"
    }
  ]
}

```