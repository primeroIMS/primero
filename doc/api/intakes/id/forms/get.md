# Query intake forms

Return the form sections configured for a registration stream.

**URL** : `/api/v2/intakes/:id/forms`

**Method** : `GET`

**Authentication** : NO

**Authorization** : No user authentication is required.

**Parameters** :

* `id` The unique identifier of the registration stream.

## Success Response

**Condition** : The request is valid.

**Code** : `200 OK`

**Content** : An array of form sections configured for the registration stream.

```json
{
  "data": [
    {
      "id": 1,
      "unique_id": "basic_identity",
      "name": {
        "en": "Basic Identity"
      },
      "description": {
        "en": "Basic identity information"
      },
      "fields": [
        {
          "name": "name",
          "type": "text_field",
          "display_name": {
            "en": "Name"
          },
          "visible": true,
          "editable": true,
          "required": false
        }
      ]
    }
  ]
}
```
