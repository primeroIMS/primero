# Fetch the individual form

Show the JSON representation of a form. 

**URL** : `/api/v2/forms/:id`

**Method** : `GET`

**Authentication** : YES

**Authorization** : The user must be authorized to view forms in Primero. A user can only
see the form if either is directly assigned through the user's role or is nested in one of
the forms assigned through the role.

**Parameters** : 

## Success Response

**Condition** : User can view this form. 

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
      "id": 90,
      "unique_id": "custom_form",
      "name": {
          "en": "Something in english 2"
      },
      "visible": true,
      "order": 0,
      "order_form_group": 0,
      "order_subform": 0,
      "editable": true,
      "initial_subforms": 0,
      "form_group_name": {
        "en": "Identification / Registration"
      },
      "fields": [
          {
              "id": 920,
              "name": "custom_field_by_api",
              "type": "subform",
              "form_section_id": 90,
              "visible": true,
              "mobile_visible": true,
              "display_name": {
                  "en": "Custom field in english",
              },
              "order": 0,
              "subform_section_id": 1,
              "link_to_path_external": true,
              "date_validation": "default_date_validation"
          }
      ],
      "module_ids": [
          "primeromodule-cp"
      ]
  }
}

```
## Error Response

**Condition** : User isn't authorized to view this form. 

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/cases/10",
      "message": "Forbidden"
    }
  ]
}

```
**Condition** : A form with the provided id doesn't exist in the database.

**Code** : `404 Not Found`

**Content** :

```json
{
  "errors": [
    {
      "code": 404,
      "resource": "/api/v2/forms/10",
      "message": "Not Found"
    }
  ]
}

```
