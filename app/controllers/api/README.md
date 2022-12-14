# Primero API

This document describes the Primero API version 2.

## Bootstrap

* [Public information about the instance](v2/docs/primero/get.md) : `GET /api/v2/primero`

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
* [List all incidents for this case](v2/docs/cases/id/incidents/get.md): `GET /api/v2/cases/:id/incidents`

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

## Traces

Endpoints for fetching data about an individual trace or matching a trace to case.
Trace data will be maintained as part of the tracing request above.

* [Fetch an individual trace](v2/docs/traces/id/get.md): `GET /api/v2/traces/:id`
* [Match a trace to a case](v2/docs/traces/id/patch.md): `PATCH /api/v2/traces/:id`

# Potential Matches

Search for potential matches for family tracing for a particular trace or case record
* [Search for traces matching a case](v2/docs/potential_matches/get.md): `GET /api/v2/cases/:id/potential_matches`
* [Search for cases matching a trace](v2/docs/potential_matches/get.md): `GET /api/v2/traces/:id/potential_matches`

## Flagging Endpoints

Endpoints for query and manipulating flags for cases, tracing request and incidents

* [Query for flags of a record](v2/docs/flags/get.md) : `GET /api/v2/:recordType/:recordId/flags`
* [Create a new flag of a record](v2/docs/flags/id/post.md) `POST /api/v2/:recordType/:recordId/flags`
* [Unflag a record](v2/docs/flags/id/patch.md) `POST /api/v2/:recordType/:recordId/flags/:id`
* [Create a bulk of flags for multiple records](v2/docs/flags/id/post.md) `POST /api/v2/:recordType/:recordId/flags`

## Attachments

Endpoints for associating files with records.
* [Attach a file](v2/docs/attachments/post.md): `POST /api/v2/:recordType/:recordId/attachments`
* [Detach a file](v2/docs/attachments/id/delete.md): `DELETE /api/v2/:recordType/:recordId/attachments/:id`

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
* [Refer a set of records in bulk](v2/docs/referrals/post_referrals.md): `POST /api/v2/cases/referrals`
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

* [Query for contact information](v2/docs/contact_information/get.md) : `GET /api/v2/contact_information`
* [Update the current contact information](v2/docs/contact_information/patch.md) : `PATCH /api/v2/contact_information`


## Configuration

Endpoints for creating, fetching, and applying the Primero configuration state.

* [Query for all configurations](v2/docs/configurations/get.md) : `GET /api/v2/configurations`
* [Fetch info about an individual configuration](v2/docs/configurations/id/get.md) : `GET /api/v2/configurations/:id`
* [Save off the current primero configuration state](v2/docs/configurations/post.md) : `POST /api/v2/configurations`
* [Apply this configuration to Primero](v2/docs/configurations/id/patch.md) : `PATCH /api/v2/configurations/:id`
* [Delete an existing configuration](v2/docs/configurations/id/delete.md) : `DELETE /api/v2/configurations/:id`


## System Setting Endpoints

Endpoints for querying system settings

* [Query for system setting](v2/docs/system_settings/get.md) : `GET /api/v2/system_settings`


## User Endpoints

Query and manipulate users

* [Query for all accessible users](v2/docs/users/get.md): `GET /api/v2/users`
* [Query for an individual user](v2/docs/users/id/get.md): `GET /api/v2/users/:id`
* [Create a new user](v2/docs/users/post.md): `POST /api/v2/users`
* [Update an existing user](v2/docs/users/id/patch.md): `PATCH /api/v2/users/:id`
* [Disable an existing user](v2/docs/users/id/delete.md): `DELETE /api/v2/users/:id`
* [Query for users to assign records to](v2/docs/users/assign-to.md): `GET /api/v2/users/assign-to`
* [Query for users to transfer records to](v2/docs/users/transfer-to.md): `GET /api/v2/users/transfer-to`
* [Query for users to refer records to](v2/docs/users/refer-to.md): `GET /api/v2/users/refer-to`
* [Request a password reset email](v2/docs/users/password-reset-request): `POST /api/v2/users/password-reset-request`
* [Request a password reset email for a specific user](v2/docs/users/id/password-reset-request): `POST /api/v2/users/:id/password-reset-request`
* [Reset a password with a special token](v2/docs/users/password-reset): `POST /api/v2/users/password-reset`

## Dashboard Endpoint

Aggregate, actionable data

* [Query avialable dashboards](v2/docs/dashboards/get.md): `GET /api/v2/dashboards`

## Export Endpoints

Initiate and query for exports

* [Query for exports](v2/docs/exports/get.md): `GET /api/v2/exports`
* [Create an export](v2/docs/exports/post.md): `POST /api/v2/exports`
* [Query for individual export](v2/docs/exports/id/get.md): `GET /api/v2/exports/:id`
* [Archive an export](v2/docs/exports/id/delete.md): `DELETE /api/v2/exports/:id`

## Report Endpoints

Endpoints for querying and manipulating individual cases and related resources in Primero.

* [Query for reports](v2/docs/reports/get.md) : `GET /api/v2/reports`
* [Fetch an individual reports](v2/docs/reports/id/get.md) : `GET /api/v2/reports/:id`
* [Create a new reports](v2/docs/reports/post.md) : `POST /api/v2/reports`
* [Update an existing reports](v2/docs/reports/id/patch.md) : `PATCH /api/v2/reports/:id`
* [Delete an existing reports](v2/docs/reports/id/delete.md) : `DELETE /api/v2/reports/:id`

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

## Alert Endpoints

Endpoints for querying the alerts from cases, incidents and tracing request of the logged user.

* [Query for the count of alerts](v2/docs/alerts/get.md) : `GET /api/v2/alerts`
* [Query for alerts of a record](v2/docs/alerts/id/get.md) : `GET /api/v2/:recordType/:recordId/alerts`

## Agency Endpoint

Endpoints for querying and manipulating individual agency and related resources in Primero.

* [Query for locations](v2/docs/agencies/get.md) : `GET /api/v2/agencies`
* [Fetch an individual location](v2/docs/agencies/id/get.md) : `GET /api/v2/agencies/:id`
* [Create a new location](v2/docs/agencies/post.md) : `POST /api/v2/agencies`
* [Update an existing location](v2/docs/agencies/id/patch.md) : `PATCH /api/v2/agencies/:id`
* [Delete an existing location](v2/docs/agencies/id/delete.md) : `DELETE /api/v2/agencies/:id`

## Role Endpoints

Endpoints for querying and manipulating individual Roles and related resources in Primero.

* [Query for roles](v2/docs/roles/get.md) : `GET /api/v2/locations`
* [Fetch an individual role](v2/docs/roles/id/get.md) : `GET /api/v2/roles/:id`
* [Create a new role](v2/docs/roles/post.md) : `POST /api/v2/roles`
* [Update an existing role](v2/docs/roles/id/patch.md) : `PATCH /api/v2/roles/:id`
* [Delete an existing role](v2/docs/roles/id/delete.md) : `DELETE /api/v2/roles/:id`

## Permission Endpoint

Endpoint for querying all available permissions

* [ Query for all available permissions](v2/docs/permissions/get.md) : `GET /api/v2/permissions`

## User Group Endpoint

Endpoints for querying and manipulating individual locations and related resources in Primero.

* [Query for User Groups](v2/docs/user_groups/get.md) : `GET /api/v2/user_groups`
* [Fetch an individual User Group](v2/docs/user_groups/id/get.md) : `GET /api/v2/user_groups/:id`
* [Create a new User Group](v2/docs/user_groups/post.md) : `POST /api/v2/user_groups`
* [Update an existing User Group](v2/docs/user_groups/id/patch.md) : `PATCH /api/v2/user_groups/:id`
* [Delete an existing User Group](v2/docs/user_groups/id/delete.md) : `DELETE /api/v2/user_groups/:id`

## Primero Module Endpoints

Endpoints for querying and manipulating individual primero module and related resources in Primero.

* [Query for primero modules](v2/docs/primero_modules/get.md) : `GET /api/v2/primero_modules`
* [Fetch an individual primero module](v2/docs/primero_modules/id/get.md) : `GET /api/v2/primero_modules/:id`
* [Update an existing primero module](v2/docs/primero_modules/id/patch.md) : `PATCH /api/v2/primero_modules/:id`

## Record History Endpoints

Endpoint for querying all record history from a specific record

* [Query for all record history from a record](v2/docs/record_history/get.md) : `GET /api/v2/:record_type/:record_id/record_history`

## Audit Log Endpoints

Endpoints for querying and manipulating individual audit log and related resources in Primero.

* [Query for audit logs](v2/docs/audit_logs/get.md) : `GET /api/v2/audit_logs`
