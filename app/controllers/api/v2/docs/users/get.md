# Query for users

Shows a paginated list of all users that are accessible to this user. The user can filter by agency, location, services and disabled.

**URL** : `/api/v2/users`

**Method** : `GET`

**Authentication** : YES

**Authorization** :The user must be authorized to view users in Primero.

**Parameters** : 

* `agency` Optional. Filters users by agency.
* `location` Optional. Filters users by location(reporting location of the user).
* `services` Optional. Filter users by services.
* `disabled` Optional. Filter users by disabled.
* `extended` Optional. Shows an extended version of the user properties. Defaults to false.
* `page` Optional. Pagination. Defaults to 1
* `per` Optional. Users per page. Defaults to 20. 

## Success Response

**Condition** : User can see one or more users. 

**Code** : `200 OK`

**Content** :

```json
{
    "data": {
        "id": 1,
        "full_name": "System Superuser",
        "user_name": "primero",
        "email": "primero@primero.com",
        "agency_id": 1,
        "role_id": "role-primero-cp",
        "time_zone": "UTC",
        "locale": "en",
        "send_mail": true,
        "created_at": "2019-08-09T19:54:36.592Z",
        "updated_at": "2019-08-09T19:54:36.592Z",
        "identity_provider_unique_id": "primeroims_2"
    },
    "metadata": {
      "total": 1,
      "per": 20,
      "page": 1
    }

}
```
## Error Response

**Condition** : User isn't authorized to query for users. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/users",
      "message": "Forbidden"
    }
  ]
}
```
