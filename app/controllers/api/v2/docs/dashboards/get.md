# List dashboards

Show a list of all the dashaboards available to this user. 
The dashboard indicators are computed and the record list query is provided 
if a click-through to the case list for that indicator is desired.  

**URL** : `/api/v2/dashboards`

**Method** : `GET`

**Authentication** : YES

**Authorization** : All logged in users are permitted to make this request. 
Users with no dashboard authorization will see an empty array. 

## Success Response
 
**Code** : `200 OK`

**Content** :

There are two types of indicator dashboards: 1-D and 2-D. 

A 1-D dashboard:

```json
{
  "data": [
    {
      "name": "workflow",
      "type": "indicator",
      "stats": {
        "new": {
          "count": 1,
          "query": ["record_state=true","status=open","workflow=new"]
        },
        "care_plan": {
          "count": 0, 
          "query": ["record_state=true","status=open","workflow=care_plan"]
        }
      }
    }
  ]
}
```

A 2-D dashboard:

```json
{
  "data": [
    {
      "name": "workflow_team",
      "type": "indicator",
      "stats": {
        "primero": {
          "new": {
            "count": 1,
            "query": ["record_state=true","status=open","owned_by=primero","workflow=new"]
          },
          "care_plan": {
            "count": 0,
            "query": ["record_state=true","status=open","owned_by=primero","workflow=care_plan"]
          }
        },
        "primero_cp": {
          "new": {
            "count": 1,
            "query": ["record_state=true","status=open","owned_by=primero_cp","workflow=new"]
          },
          "care_plan": {
            "count": 0,
            "query": ["record_state=true","status=open","owned_by=primero_cp","workflow=care_plan"]
          }
        }
      }   
    }
  ]
}         
```
