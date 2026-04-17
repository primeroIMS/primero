# Import locations

Import locations from a csv file and return status.

**URL** : `/api/v2/locations/import`

**Method** : `POST`

**Authentication** : YES

**Authorization** : The user must be authorized to edit locations in Primero.

**Parameters** :

* `data` IO Stream data read from a csv file.
```json
{
  "data": {
    "file_name": "<path>/locations.csv",
    "data_base64": "T0JKRUNUSUQgKixTaGFwZSAqLGFkbWluM05hbWVfZW4sYWRtaW4zTmFtZV9h\ncixhZG1pbjNQY29kZSxhZG1pbjNSZWZOYW1lLGFkbWluM0FsdE5hbWUxX2Vu\nLGFkbWluM0FsdE5hbWUyX2VuLGFkbWluM0FsdE5hbWUxX2FyLGFkbWluM0Fs\ndE5hbWUyX2FyLGFkbWluMk5hbWVfZW4sYWRtaW4yTmFtZV9hcixhZG1pbjJQ\nY29kZSxhZG1pbjFOYW1lX2VuLGFkbWluMU5hbWVfYXIsYWRtaW4xUGNvZGUs\nYWRtaW4wTmFtZV9lbixhZG1pbjBOYW1lX2FyLGFkbWluMFBjb2RlLGRhdGUs\ndmFsaWRPbix2YWxpZFRvLFNoYXBlX0xlbmd0aCxTaGFwZV9BcmVhDQosLCNh\nZG0zK25hbWUsI2FkbTMrbmFtZSthci1sYiwjYWRtMytjb2RlLCwsLCwsI2Fk\nbTIrbmFtZSwjYWRtMituYW1lK2FyLWxiLCNhZG0yK2NvZGUsI2FkbTErbmFt\nZSwjYWRtMStuYW1lK2FyLWxiLCNhZG0xK2NvZGUsI2NvdW50cnkrbmFtZSwj\nY291bnRyeStuYW1lK2FyLWxiLCNjb3VudHJ5K2NvZGUsLCwsLA0KMSxQb2x5\nZ29uLEFiaSBHaGFyYXEs2KfYqNmKINi62LHZgixJUUcwN1EwMk4wMiw8TnVs\nbD4sPE51bGw+LDxOdWxsPiw8TnVsbD4sPE51bGw+LEFsLUhpbGxhLNin2YTY\nrdmE2KksSVFHMDdRMDIsQmFiaWws2KjYp9io2YQsSVFHMDcsSXJhcSzYp9mE\n2LnYsdin2YIsSVEsNS8zMC8yMDE5LDYvMy8yMDE5LDxOdWxsPiwwLjYxODgw\nNiwwLjAxNTc1NA0KMixQb2x5Z29uLEFidSBEYWxmLNin2KjZiCDYr9mE2YEs\nSVFHMTZRMDFOMDIsPE51bGw+LDxOdWxsPiw8TnVsbD4sPE51bGw+LDxOdWxs\nPixBbC1EYXVyLNin2YTYr9mI2LEsSVFHMTZRMDEsU2FsYWggQWwtRGluLNi1\n2YTYp9itINin2YTYr9mK2YYsSVFHMTYsSXJhcSzYp9mE2LnYsdin2YIsSVEs\nNS8zMC8yMDE5LDYvMy8yMDE5LDxOdWxsPiwxLjczNzk0OCwwLjE0NTg4Mw0K\n"
  }
}
```

## Success Response

**Condition** : User can import locations.

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "status": "success",
    "total": 294,
    "file_name": "<path>/locations.csv",
    "success_total": 294,
    "failure_total": 0,
    "failures": []
  }
}
```

---

**Condition** : Some rows were not processed.

**Code** : `200 OK`

**Content** :

```json
{
  "data": {
    "status": "some_failure",
    "total": 294,
    "file_name": "<path>/locations.csv",
    "success_total": 292,
    "failure_total": 2,
    "failures": [6, 11]
    "error_messages": ['Row 6 Not Processed: adm2+code blank', 'Row 11 Not Processed: adm1+code blank']
  }
}
```

## Error Response

**Condition** : User isn't authorized to create locations.

**Code** : `403 Forbidden`

**Content** :

```json
{
  "errors": [
    {
      "code": 403,
      "resource": "/api/v2/locations/import",
      "message": "Forbidden"
    }
  ]
}
```
