# Delete an existing configuration

Delete a configuration with the specified id.

**URL** : `/api/v2/configuration/:id`

**Method** : `DELETE`

**Authentication** : YES

**Authorization** : The user must be authorized to manage configurations.

**Parameters** : No parameters

## Success Response

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "id": "ac3d041c-1592-4f99-8191-b38fbe448735"
  }
}
```

## Error Response

**Condition** : User isn't authorized tomanage configurations.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/configurations/ac3d041c-1592-4f99-8191-b38fbe448735",
      "message": "Forbidden"
    }
  ]
}
```

---

**Condition** : A configuration with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/configurations/thisdoesntexist",
      "message": "Not Found"
    }
  ]
}
```
