# Query for managed reports

Shows all managed reports that are accessible to this user. The managed reports are not built,
therefore the report data is not available in the response.

**URL** : `/api/v2/managed_reports`

**Method** : `GET`

**Authentication** : YES

**Authorization** :The user must be authorized to view managed reports in Primero.

**Parameters** : No parameters 

## Success Response

**Condition** : User can see one or more managed reports.

**Code** : `200 OK`

**Content** :

```json
{
    "data": [
        {
            "id": "violations",
            "name": "managed_reports.violations.name",
            "description": "managed_reports.violations.description",
            "module_id": "primeromodule-mrm",
            "subreports": [
              "killing",
              "maiming"
            ]
        },
    ],
    "metadata": {
      "total": 1
    }

}
```
## Error Response

**Condition** : User isn't authorized to see for managed reports.

**Code** : `200 OK`

**Content** :

```json
{
  "data": [],
    "metadata": {
      "total": 0
    }
}
```
