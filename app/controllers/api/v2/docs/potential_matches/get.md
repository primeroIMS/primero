# List all potential matches based on teh configured matching criteria for this record

**URL** :
 - `/api/v2/cases/:id/potential_matches`
 - `/api/v2/traces/:id/potential_matches`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view this record.

**Parameters** : No parameters

## Success Response

**Condition** : The user is authorized to view this record.

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "potential_matches": [
      {
        "likelihood": "likely",
        "score": 1.0,
        "case": {
          "id": "c8229b05-d478-4dce-82c5-a1991c487182",
          "case_id_display": "20200720-45a0fec",
          "name": "Test",
          "age": 5,
          "sex": "male",
          "owned_by": null,
          "owned_by_agency_id": null
        },
        "trace": {
          "id": "912bcaff-7963-4d18-9c2e-a1faf83f117f",
          "tracing_request_id": "9e041fa0-ffd3-465a-8985-2d9072dcc05a",
          "inquirer_id": "72f37c70-0408-4476-9081-365212c66e4b",
          "relation": null,
          "relation_name": "Test 1",
          "inquiry_date": "2019-03-01",
          "name": "Test"
        },
        "comparison": {
          "case_to_trace": [
            {"field_name": "name", "match": "match", "case_value": "Test", "trace_value": "Test"},
            ...
          ],
          "family_to_inquirer": [
            [
              {"field_name": "relation", "match": "match", "case_value": "father", "trace_value": "father"},
              {"field_name": "relation_name", "match": "match", "case_value": "Father's Name", "trace_value": "Father's Name"},
            ],
            [
              {"field_name": "relation", "match": "mismatch", "case_value": "mother", "trace_value": "father"},
              {"field_name": "relation_name", "match": "mismatch", "case_value": "Mother's Name", "trace_value": "Father's Name"},
            ],
            ...
          ]
        }
      },
      ...
    ],
    "record": {
      "id": "912bcaff-7963-4d18-9c2e-a1faf83f117f",
      "type": "trace"
    }
  }
}
```
## Error Response

**Condition** : User isn't authorized to view this record.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/traces/912bcaff-7963-4d18-9c2e-a1faf83f117f/potential_matches",
      "message": "Forbidden"
    }
  ]
}
```
