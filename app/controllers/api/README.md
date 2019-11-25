# Primero API

This document describes the Primero API version 2. A deprecated version 1 of the API, currently used by the mobile application, is still available under /api. This may not be available in the future.  


## Authentication

All other endpoints will require the Authorization header set with a bearer token issued by these endpoints.
The tokens expire after 60 minutes. 

* [Issue or re-issue a new JWT token](v2/docs/tokens/post.md) : `POST /api/v2/tokens`
* [Invalidate an existing token](v2/docs/tokens/delete.md) : `DELETE /api/v2/tokens`

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

## Flagging Endpoints

Endpoints for query and manipulating flags for cases, tracing request and incidents

* [Query for flags of a record](v2/docs/flags/get.md) : `GET /api/v2/:recordType/:recordId/flags`
* [Create a new flag of a record](v2/docs/flags/id/post.md) `POST /api/v2/:recordType/:recordId/flags`
* [Unflag a record](v2/docs/flags/id/patch.md) `POST /api/v2/:recordType/:recordId/flags/:id`
* [Create a bulk of flags for multiple records](v2/docs/flags/id/post.md) `POST /api/v2/:recordType/:recordId/flags`

## Transitions

Transitions change the access rights of users to records. 
Currently only case records may be transitioned. We have the following:

### Assigns

An assign changes the record owner of a particular record.
* [List all record assignments that took place for a record](v2/docs/assigns/get.md): `GET /api/v2/cases/:id/assigns`
* [Assign a record](v2/docs/assigns/id/post.md): `POST /api/v2/cases/:id/assigns`
* [Assign a set of records in bulk](v2/docs/assigns/post.md): `POST /api/v2/cases/assigns`

### Referrals

A referral grants an additional user access to this record.
* [List all referrals that took place for a record](v2/docs/referrals/get.md): `GET /api/v2/cases/:id/referrals`
* [Refer a record](v2/docs/referrals/id/post.md): `POST /api/v2/cases/:id/referrals`
* [Refer a set of records in bulk](v2/docs/referrals/post.md): `POST /api/v2/cases/referrals`
* [Relinquish or retract a referral](v2/docs/referrals/id/delete.md): `DELETE /api/v2/cases/:id/referrals/:referral_id`


### Transfers

A transfer initiates a process to switch the record owner. 
The receiving user must accept or reject the transfer before becoming the record owner.
* [List all transfers that took place for a record](v2/docs/transfers/get.md): `GET /api/v2/cases/:id/transfers`
* [Transfer a record](v2/docs/transfers/id/post.md): `POST /api/v2/cases/:id/transfers`
* [Transfer a set of records in bulk](v2/docs/transfers/post.md): `POST /api/v2/cases/transfers`
* [Accept or decline a transfer](v2/docs/transfers/id/patch.md): `PATCH /api/v2/cases/:id/transfers/:transfer_id`

### Transfer Requests

A transfer request starts the workflow for initiating a transfer to the requesting user.
* [List all transfer requests that took place for a record](v2/docs/transfer_requests/get.md): `GET /api/v2/cases/:id/transfer_requests`
* [Make a transfer request for a record](v2/docs/transfer_requests/id/post.md): `POST /api/v2/cases/:id/transfer_requests`
* [Accept or decline a transfer request](v2/docs/transfer_requests/id/patch.md): `PATCH /api/v2/cases/:id/transfer_requests/:transfer_request_id`

### Transitions

A transition is a Transfer, Assign, Referral, or TransferRequests.
* [List all transitions for this record](v2/docs/transitions/get.md): `GET /api/v2/cases/:id/transitions`

## Form Section Endpoints

Endpoints for querying and manipulating individual form sections and related resources in Primero.
The API behavior is similar to that of cases.

* [Query for forms](v2/docs/forms/get.md) : `GET /api/v2/forms`
* [Fetch an individual form](v2/docs/forms/id/get.md): `GET /api/v2/forms/:id`
* [Create a new form](v2/docs/forms/post.md) `POST /api/v2/forms`
* [Update an existing form](v2/docs/forms/id/patch.md) `PATCH /api/v2/forms/:id`
* [Delete an existing form with its associated fields](v2/docs/forms/id/delete.md) `DELETE /api/v2/forms/:id`


## Contact Information Endpoint

Endpoints for querying contact information

* [Query for contact informationg](v2/docs/contact_information/get.md) : `GET /api/v2/contact_information`


## System Setting Endpoints

Endpoints for querying system settings

* [Query for system setting](v2/docs/system_settings/get.md) : `GET /api/v2/system_settings`


## User Endpoints

Query and manipulate users

* [Query for an individual user](v2/docs/users/id/get.md): `GET /api/v2/users/:id`
* [Query for users to assign records to](v2/docs/users/assign-to.md): `GET /api/v2/users/assign-to`
* [Query for users to transfer records to](v2/docs/users/transfer-to.md): `GET /api/v2/users/transfer-to`
* [Query for users to refer records to](v2/docs/users/refer-to.md): `GET /api/v2/users/refer-to`
* [Query for flags of a record](v2/docs/flags/get.md) : `GET /api/v2/:recordType/:recordId/flags`
* [Create a new flag of a record](v2/docs/flags/id/post.md) `POST /api/v2/:recordType/:recordId/flags`
* [Unflag a record](v2/docs/flags/id/patch.md) `POST /api/v2/:recordType/:recordId/flags/:id`
* [Create a bulk of flags for multiple records](v2/docs/flags/id/post.md) `POST /api/v2/:recordType/:recordId/flags`

## Dashboard Endpoint

Aggregate, actionable dat.a

* [Query avialable dashboards](v2/docs/dashboards/get.md): `GET /api/v2/dashboards`

## Report Endpoints

Endpoints for querying and manipulating individual cases and related resources in Primero.

* [Query for reports](v2/docs/reports/get.md) : `GET /api/v2/reports`
* [Fetch an individual case](v2/docs/reports/id/get.md) : `GET /api/v2/reports/:id`

## Lookup Endpoints

Endpoints for querying and manipulating individual lookups and related resources in Primero.

* [Query for lookups](v2/docs/lookups/get.md) : `GET /api/v2/lookups`
* [Fetch an individual lookup](v2/docs/lookups/id/get.md) : `GET /api/v2/lookups/:id`
* [Create a new lookup](v2/docs/lookups/post.md) : `POST /api/v2/lookups`
* [Update an existing lookup](v2/docs/lookups/id/patch.md) : `PATCH /api/v2/lookups/:id`
* [Delete an existing lookup](v2/docs/lookups/id/delete.md) : `DELETE /api/v2/lookups/:id`

## Location Endpoints

Endpoints for querying and manipulating individual locations and related resources in Primero.

* [Query for locations](v2/docs/locations/get.md) : `GET /api/v2/locations`
* [Fetch an individual location](v2/docs/locations/id/get.md) : `GET /api/v2/locations/:id`
* [Create a new location](v2/docs/locations/post.md) : `POST /api/v2/locations`
* [Update an existing location](v2/docs/locations/id/patch.md) : `PATCH /api/v2/locations/:id`
* [Delete an existing location](v2/docs/locations/id/delete.md) : `DELETE /api/v2/locations/:id`
