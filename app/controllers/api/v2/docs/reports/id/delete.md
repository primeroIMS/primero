# Delete an existing report

Delete an report with the specified id.

**URL** : `/api/v2/reports/:id`

**Method** : `DELETE`

**Authentication** : YES

**Authorization** : The user must be authorized to delete reports in Primero.

**Parameters** : No parameters

## Success Response

**Condition** : User can delete reports.

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "id": "100"
  }
}
```

## Error Response

**Condition** : User isn't authorized to delete report.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/reports/200",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : A report with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/reports/thisdoesntexist",
      "message": "Not Found"
    }
  ]
}
```
