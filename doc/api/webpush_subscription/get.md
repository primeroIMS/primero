# Query for Webpush Subscriptions

Show a list of Webpush Subscriptions for the logged user

**URL** : `/api/v2/webpush/subscriptions`

**Method** : `GET`

**Authentication** : YES

**Authorization** : All logged in users are permitted to make this request.

**Parameters** :

* `notification_url` Optional. Depending on this parameter if returns only webpush subscriptions filter by it

## Success Response

**Condition** : A logged in user and Webpush must be enabled

**Code** : `200 OK`

**Content** :

```json
{
    "data": [

        {
        "id": 7,
        "user_id": 3,
        "disabled": false,
        "notification_url": "https://localhost/3",
        "created_at": "2023-07-27T18:51:15.005Z",
        "updated_at": "2023-07-27T18:51:15.005Z"
        },
        {
        "id": 10,
        "user_id": 3,
        "disabled": false,
        "notification_url": "https://abcabac",
        "created_at": "2023-07-28T02:43:30.608Z",
        "updated_at": "2023-07-28T02:47:11.932Z"
        }
    ]
}
```

