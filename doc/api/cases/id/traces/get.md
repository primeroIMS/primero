# Query traces for a case

Show a list of all traces associated with this case.

**URL** : `/api/v2/cases/:id/traces`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view this case in Primero

## Success Response

**Condition** : User can see this case.

**Code** : `200 OK`

**Content** :

```json
{
 
  "data": [
    {
      "id": "ea9f49c7-4cd4-4574-b61b-9b89751a695d",
      "matched_case_id": "0883ab93-1145-4ef0-80f8-d4e1d8b8ca91",
      "tracing_request_id": "d46da5e6-9525-40a6-adc1-8cfbb889ea27",
      "inquirer_id": "b24cf026-d77a-4c0c-a8b8-266237f45b2a",
      "relation": "Relation 1",
      "relation_name": "Person 1",
      "inquiry_date": "2021-01-14",
      "name": "Person 2",
      "age": 10,
      "sex": "male"
    },
    {
      "id": "a1e4fad7-4cd4-4574-b61b-9b89751a695d",
      "matched_case_id": "46255137-6e66-486d-b809-e1b825e840a8",
      "tracing_request_id": "d46da5e6-9525-40a6-adc1-8cfbb889ea27",
      "inquirer_id": "b24cf026-d77a-4c0c-a8b8-266237f45b2a",
      "relation": "Relation 2",
      "relation_name": "Person 2",
      "inquiry_date": "2021-01-14",
      "name": "Person 3",
      "age": 5,
      "sex": "female"
    }
  ]
}
```

## Error Response

**Condition** : User isn't authorized to access this case.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/cases/:id/traces",
      "message": "Forbidden"
    }
  ]
}
```
