<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->

# Query for webpush configuration

Shows if webpush server is enabled or not, and its vapid_public.

**URL** : `/api/v2/webpush/config`

**Method** : `GET`

**Authentication** : YES

**Authorization** : All logged in users are permitted to make this request.

**Parameters** : No parameters

## Success Response

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "enabled": true|false,
    "vapid_public": "my_vapid_public"
  }
}
```
## Error Response

**Condition** : User isn't logged to view this alerts.

**Code** : `401 Unauthorized`

**Content** :

```json
{
  "error": "revoked token"
}
```