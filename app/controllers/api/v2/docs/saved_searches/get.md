# Query for saved searches

Show a paginated list of all saved searches that are accessible to this user.

**URL** : `/api/v2/saved_searches`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view saved searches in Primero.

**Parameters** :

* `page` Optional. Pagination. Defaults to 1
* `per` Optional. Records per page. Defaults to 20.

## Success Response

**Condition** : User can see one or more saved searches.

**Code** : `200 OK`

**Content** :

```json
{
    "data": [
        {
            "id": 1,
            "name": "my filter",
            "module_ids": [
                "primeromodule-cp",
                "primeromodule-gbv"
            ],
            "record_type": "case",
            "user_name": "primero",
            "filters": {
                "name": "flag",
                "value": [
                    "single",
                    "flag"
                ]
            }
        }
    ],
    "metadata": {
        "total": 1,
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
      "resource": "/api/v2/saved_searches",
      "message": "Forbidden"
    }
  ]
}
```
