# Fetch the individual trace

Show the JSON representation of a trace.

**URL** : `/api/v2/traces/:id`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view the parent tracing request in Primero. As with other record types, the user's ability to view this trace depends on the authorization scope.

## Success Response

**Condition** : User can view this trace.

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "id": "f7884b5f-848c-4f98-b60c-bd8ffeceb175",
    "matched_case_id": null,
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

**Condition** : User isn't authorized to view the associated tracing request.

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
