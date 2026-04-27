# Create|Ping a new subscription

Create a new subscription for the currently signed in user

**URL** : `/api/v2/webpush/subscriptions`

**Method** : `POST`

**Authentication** : YES

**Authorization** : All logged in users are permitted to make this request.

**Parameters** :

* `data` A JSON representation of the webpush subscription to be created. This must include `notification_url`, `auth`, and `p256dh`. If a subscription already exists for this user and `notification_url` then ignore `auth` and `p256dh` and update the `updated_at` field.

```json
{
  "data": {
    "notification_url": "https://ab2ca2bac",
    "auth": "tercer auth from API",
    "p256dh": "tercer p256dh from API"
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
    "id": 12,
    "user_id": 3,
    "disabled": false,
    "notification_url": "https://ab2ca2bac",
    "created_at": "2023-07-28T16:50:07.531Z",
    "updated_at": "2023-07-28T16:56:53.056Z"
  }
}
```

## Error Response

**Condition** : Whe subscription does not exist for the current user and `notification_url`.

**Code** : `422 ActiveRecord::RecordInvalid`

**Content** :

```json
{
  "errors": [
    {
      "status": 422,
      "resource": "/api/v2/webpush/subscriptions",
      "detail": "p256dh",
      "message": [
        "errors.models.webpush_subscription.p256dh_present"
      ]
    }
  ]
}
```
