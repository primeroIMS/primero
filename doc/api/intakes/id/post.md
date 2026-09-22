# Submit an intake

Create a record through a registration stream. The record type, module, default
owner, and available fields are defined by the registration stream identified by
the URL parameter.

**URL** : `/api/v2/intakes/:id`

**Method** : `POST`

**Authentication** : NO

**Authorization** : No user authentication is required. The registration stream
must exist and be configured to accept intake submissions.

**Parameters** :

* `id` The unique identifier of the registration stream.
* `data` A JSON representation of the record to create. Include the fields
configured for the registration stream and, when CAPTCHA is enabled, a
`captcha_token` returned by the configured CAPTCHA provider.

```json
{
  "data": {
    "name": "Edwine Edgemont",
    "age": 16,
    "sex": "female",
    "captcha_token": "captcha-response-token"
  }
}
```

The server sets the created record's type and module from the registration
stream, sets its status to `identified`, and assigns it to the stream's default
record owner.

## Success Response

**Condition** : The registration stream exists and the submitted record data is
valid.

**Code** : `200 OK`

**Content** : The created record, including server-generated fields.

```json
{
  "data": {
    "id": "b3222e84-a5d7-4692-a643-1ab3d41f17d6",
    "name": "Edwine Edgemont",
    "age": 16,
    "sex": "female",
    "status": "identified",
    "created_at": "2019-05-10T05:34:59.514Z"
  }
}
```

## Error Response

**Condition** : No registration stream exists for the provided `id`.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/intakes/b3222e84-a5d7-4692-a643-1ab3d41f17d6",
      "message": "Not Found"
    }
  ]
}
```

---

**Condition** : The submitted record data is invalid.

**Code** : `422 Unprocessable Entity`

**Content** :

```json
{
  "errors": [
    {
      "code": 422,
      "resource": "/api/v2/intakes/b3222e84-a5d7-4692-a643-1ab3d41f17d6",
      "message": "Please enter the date in a valid format (dd-mmm-yyyy)",
      "detail": "registration_date"
    }
  ]
}
```
