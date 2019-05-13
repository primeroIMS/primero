# Query for cases

Show a paginated list of all cases that are accessible to this user. The user can filter the case list based on search criteria. 

**URL** : `/api/v2/cases`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view cases in Primero. The full set of cases viewable by this user
depends on the user's authorization scope: just cases the user is assigned to, cases that are associated with all 
users in this user's user groups, or all cases in the system. The fields that are shown for each case 
are only fields that this user is permitted to view. 

**Parameters** : 

* `query` Optional. A text query over a special set of fields such as names and identifiers.
* Filter query over case fields of type select, numeric, date, booleans. 
Query values can be comma-separated lists and date and numeric ranges. Optional
Example `sex=male&age=10..15&protection_concerns=unaccompanied,separated`
* `fields` Optional. A comma-separated list of fields that will be returned in the json data. 
If unspecified this displays all permitted fields. The special value `short` will return a condensed
list of relevant permitted fields.
* `page` Optional. Pagination. Defaults to 1
* `per` Optional. Records per page. Defaults to 20. 

## Success Response

**Condition** : User can see one or more cases. 

**Code** : `200 OK`

**Content** :

```json
{
  "data": [
    {
      "id": "b3222e84-a5d7-4692-a643-1ab3d41f17d6",
      "age": 16,
      "sex": "female",
      "name": "Edwine Edgemont",
      "owned_by": "primero",
      "created_at": "2019-05-10T05:34:59.514Z",
      "case_id_display": "f15a1a9",
      "registration_date": "2019-05-10"
    },
    {
      "id": "442fa6e6-4682-4fdf-b9dc-2cdf51c5e8c3",
      "age": 22,
      "sex": "male",
      "name": "Johnsy Jones",
      "owned_by": "primero",
      "created_at": "2019-05-08T03:14:15.133Z",
      "case_id_display": "af0f298",
      "registration_date": "2019-05-07"
    }
  ],
  "metadata": {
      "total": 2,
      "per": 20,
      "page": 1
  }
}

```
## Error Response

**Condition** : User isn't authorized to query for cases. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/cases",
      "message": "Forbidden"
    }
  ]
}

```