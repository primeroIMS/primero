# Ping|Disable|Enable a subscription

Update the `updated_at` field for a subscription for this user and url. Optionally, `disable|enable` this subscription.

**URL** : `/api/v2/webpush/subscriptions/current`

**Method** : `PATCH`

**Authentication** : YES

**Authorization** : All logged in users are permitted to make this request.

**Parameters** :

* `data["disabled"]` Optional. Depending on this parameter if returns only webpush subscriptions filter by it

```json
{
  "data": {
    "notification_url": "https://ab1ca1bac",
    "disabled": false
  }
}
```

## Success Response

**Condition** : A logged in user and Webpush must be enabled

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "id": 11,
    "user_id": 3,
    "disabled": true,
    "notification_url": "https://ab1ca1bac",
    "created_at": "2023-07-28T02:47:30.289Z",
    "updated_at": "2023-07-28T17:19:54.703Z"
  }
}
```
## Error Response

**Condition** : When one of the parameters is not present.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "status": 404,
      "resource": "/api/v2/webpush/subscriptions/current",
      "detail": "ActiveRecord::RecordNotFound",
      "message": "Not Found"
    }
  ]
}
```
