# Update the current contact information

Merge the values submitted in this call into the current contact information.

**URL** : `/api/v2/contact_information`

**Method** : `PATCH`

**Authentication** : YES

**Authorization** : The user must be authorized to edit the current contact information in Primero.

**Parameters** :

* `data` A JSON representation of the current contact information fields that will be updated.

```json
{
  "data": {
    "name": "name_test",
    "organization": "organization_test",
    "phone": "phone_test",
    "location": "location_test",
    "other_information": "other_information_test",
    "support_forum": "support_forum_test",
    "email": "email_test",
    "position": "position_test"
  }
}
```

## Success Response

**Condition** : User can update the current contact information.

**Code** : `200 OK`

**Content** : A JSON representation of the current contact information that has been updated.

```json
{
  "data": {
    "id": 1,
    "name": "name_test",
    "organization": "organization_test",
    "phone": "phone_test",
    "location": "location_test",
    "other_information": "other_information_test",
    "support_forum": "support_forum_test",
    "email": "email_test",
    "position": "position_test"
  }
}
```

## Error Response

**Condition** : User isn't authorized to update agencies.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/agencies/100",
      "message": "Forbidden"
    }
  ]
}
```
