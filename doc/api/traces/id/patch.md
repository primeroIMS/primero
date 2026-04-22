# Update an existing trace to match it to case

This API call will associate a matching case with this trace. All other trace data is maintained using
the Tracing Request API.

**URL** : `/api/v2/traces/:id`

**Method** : `PATCH`

**Authentication** : YES

**Authorization** : The user must be authorized to update the associated tracing request in Primero

**Parameters** :

* `data` A JSON representation of the record fields that will be updated.
```json
{
  "data": {
    "matched_case_id": "b3222e84-a5d7-4692-a643-1ab3d41f17d6"
  }
}
```

## Success Response

**Condition** : User is allowed to update this trace.

**Code** : `200 OK`

**Content** : A JSON representation of the trace.
```json
{
  "data": {
    "id": "f7884b5f-848c-4f98-b60c-bd8ffeceb175",
    "matched_case_id": "b3222e84-a5d7-4692-a643-1ab3d41f17d6",
    "tracing_request_id": "71eadfe8-b8ac-463f-bf32-7d31f16a36eb",
    "inquirer_id": "0159061f-6183-410c-a107-fcc5de8bb2fc",
    "relation": "father",
    "relation_name": "Arun Lee",
    "inquiry_date": "2019-03-01",
    "name": "Olga Lee",
    "age": 9,
    "sex": "female"
  }
}
```

## Error Response

**Condition** : User isn't authorized to update this trace.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/traces/f7884b5f-848c-4f98-b60c-bd8ffeceb175",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : A trace with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/traces/f7884b5f-848c-4f98-b60c-bd8ffeceb175",
      "message": "Not Found"
    }
  ]
}
```
