# Query intake lookups

Return a paginated list of lookup values for an intake client.

**URL** : `/api/v2/intakes/:id/lookups`

**Method** : `GET`

**Authentication** : NO

**Authorization** : No user authentication is required.

**Parameters** :

* `id` The unique identifier of the registration stream used by the intake
client. The current endpoint returns the standard lookup list and does not
filter lookup results by this value.
* `page` Optional. Pagination. Defaults to 1.
* `per` Optional. Records per page. Defaults to 20. Maximum is 1000.

## Success Response

**Condition** : The request is valid.

**Code** : `200 OK`

**Content** : A paginated list of lookups and their values.

```json
{
  "data": [
    {
        "id": 1,
        "unique_id": "lookup-nationality",
        "name": {
            "en": "Nationality",
            "fr": "",
            "es": ""
        },
        "values": [
            {
                "id": "nationality1",
                "display_text": {
                    "en": "Nationality",
                    "fr": "",
                    "es": ""
                }
            }
        ]
    }
  ],
  "metadata": {
  "total": 1,
  "per": 20,
  "page": 1
  }
}
```
