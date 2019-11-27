# Query for alerts

It show the count of alerts from cases, incidents and tracing request of the logged user

**URL** : `/api/v2/alerts`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view alerts in Primero.

**Parameters** : No parameters

## Success Response

**Condition** : The user logged can see the count of alerts from cases, incidents and tracing request

**Content** :

```json
{
  "data": {
    "case": 2,
    "incident": 3,
    "tracing_request": 1
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