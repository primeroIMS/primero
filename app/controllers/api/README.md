# Primero API

This document describes the Primero API version 2. A deprecated version 1 of the API, currently used by the mobile application, is still available under /api. This may not be available in the future.  


## Authentication

TODO. All other endpoints will require authentication.


## Case Endpoints

Endpoints for querying and manipulating individual cases and related resources in Primero.

* [Query for cases](v2/docs/cases/get.md) : `GET /api/v2/cases`
* [Fetch an individual case](v2/docs/cases/id/get.md) : `GET /api/v2/cases/:id`
* [Create a new case](v2/docs/cases/post.md) : `POST /api/v2/cases`
* [Update an existing case](v2/docs/cases/id/patch.md) : `PATCH /api/v2/cases/:id`
* [Disable an existing case](v2/docs/cases/id/delete.md) : `DELETE /api/v2/cases/:id`

## Incident Endpoints

Endpoints for querying and manipulating individual incidents and related resources in Primero.
The API behavior is identical to that of cases. See the case endpoints above for documentation details.

* Query for incidents: `GET /api/v2/incidents`
* Fetch an individual incident: `GET /api/v2/incidents/:id`
* Create a new incident: `POST /api/v2/incidents`
* Update an existing incident: `PATCH /api/v2/incidents/:id`
* Disable an existing incident: `DELETE /api/v2/incidents/:id`

## Tracing Request Endpoints

Endpoints for querying and manipulating individual tracing requests and related resources in Primero.
The API behavior is identical to that of cases. See the case endpoints above for documentation details.

* Query for tracing requests: `GET /api/v2/tracing_requests`
* Fetch an individual tracing request: `GET /api/v2/tracing_requests/:id`
* Create a new tracing request: `POST /api/v2/tracing_requests`
* Update an existing tracing request: `PATCH /api/v2/tracing_requests/:id`
* Disable an existing tracing request: `DELETE /api/v2/tracing_requests/:id`


## Form Section Endpoints

Endpoints for querying and manipulating individual form sections and related resources in Primero.
The API behavior is similar to that of cases.

* [Query for forms](v2/docs/forms/get.md) : `GET /api/v2/forms`
* [Fetch an individual form](v2/docs/forms/id/get.md): `GET /api/v2/forms/:id`
* [Create a new form](v2/docs/forms/post.md) `POST /api/v2/forms`
* [Update an existing form](v2/docs/forms/id/patch.md) `PATCH /api/v2/forms/:id`
* [Delete an existing form with its associated fields](v2/docs/forms/id/delete.md) `DELETE /api/v2/forms/:id`
