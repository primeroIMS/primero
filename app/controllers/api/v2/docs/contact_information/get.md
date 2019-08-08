# Query for contact information

Retrieve the contact information for Primero as JSON

**URL** : `/api/v2/contact_information`

**Method** : `GET`

**Authentication** : NO

**Parameters** : No parameters 

## Success Response

**Condition** : User can see the contact information.

**Code** : `200 OK`

**Content** :

```json
{
    "data": {
        "name": "User contact information",
        "organization": "UNICEF",
        "phone": "+1 234 5678 9000",
        "other_information": "Other info",
        "support_forum": "https://www.primero.org/support",
        "position": "Case worker",
        "system_version": "2.0.0.1"
    }
}
```
