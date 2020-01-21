# Approvals for a record

Perform approvals on records. Currently there are three approvals: BIA, CASE_PLAN and CLOSURE

**URL** : `/api/v2/cases/:id/approvals/:approval_id`

**Method** : `PATCH`

**Authentication** : YES

**Authorization** : The user must be authorized to perform the specific approval on records.

**Parameters** :
* `data` A JSON representation for the approval action, which contains the __approval_status__ property that
specifies if rejected, requested or approved.
If the __approval_status__ is "requested", only the property __approval_status__ is needed, however when
the approval_id is __case_plan__, the __approval_type__ can also be specified.

If the __approval_status__ is either "rejected" or "approved", an optional __notes__ field can be specified.

```json
{
  "data": {
    "approval_status": "approved"
  }
}
```

## Success Response

**Condition** : User can perform approvals.

**Code** : `200 OK`

**Content** : A JSON representation of the approval.

```json
{
  "data": {
    "record": {
      "id": "73367d97-67f0-4073-86e8-f1b95a0f62e2",
      "approval_subforms": [
        {
            "unique_id": "6e96ab79-d786-4117-a48c-c99194741beb",
            "requested_by": "primero_user",
            "approval_date": "2020-01-15",
            "approval_status": "requested",
            "approval_requested_for": "bia"
        }
      ],
      "approval_status_bia": "pending"
    }
  }
}
```

---

## Error Response

**Condition** : User isn't authorized to perform approvals.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/cases/b3222e84-a5d7-4692-a643-1ab3d41f17d6/approvals/:approval_id",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : User performs an approval on a non-existen record.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/cases/b3222e84-a5d7-4692-a643-1ab3d41f17d6/approvals/:approval_id",
      "message": "Not Found"
    }
  ]
}
```

---

**Condition** : User performs a non-existent approval.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/cases/b3222e84-a5d7-4692-a643-1ab3d41f17d6/approvals/unknown-approval-id",
      "message": "Not Found"
    }
  ]
}
```

---

**Condition** : The approval parameters would create an invalid approval.

**Code** : `422 Unprocessable Entity`

**Content** :

```json
{
  "errors": [
    {
      "code": 422,
      "resource": "/api/v2/cases/b3222e84-a5d7-4692-a643-1ab3d41f17d6/approvals/bia",
      "message": "approvals.error_invalid_status"
    }
  ]
}
```
