export const CUSTOM_EXPORT_FILE_NAME_FIELD = "filename";

export const REFERRAL_FIELD = "referral";

export const TRANSITION_TYPE = REFERRAL_FIELD;

export const SERVICE_EXTERNAL_REFERRAL = "service_external_referral";

export const STATE_REFERRAL_LOADING_PATH = ["records", "transitions", "referral", "loading"];

export const STATE_REFERRAL_USERS_PATH = ["records", "transitions", "referral", "users"];

export const FIELDS = Object.freeze({
  ROLE: "role",
  CONSENT_INDIVIDUAL_TRANSFER: "consent_overridden",
  REMOTE: "remote",
  SERVICE: "service",
  AGENCY: "transitioned_to_agency",
  LOCATION: "location",
  TRANSITIONED_TO: "transitioned_to",
  TRANSITIONED_TO_REMOTE: "transitioned_to_remote",
  NOTES: "notes",
  FILENAME: CUSTOM_EXPORT_FILE_NAME_FIELD,
  SERVICE_RECORD_ID: "service_record_id"
});

export const USER_FIELDS = Object.freeze({
  AGENCY: "agency",
  LOCATION: "location",
  USER_NAME: "user_name"
});

export const SERVICE_SECTION_FIELDS = Object.freeze({
  [FIELDS.LOCATION]: "service_delivery_location",
  [FIELDS.AGENCY]: "service_implementing_agency",
  [FIELDS.TRANSITIONED_TO]: "service_implementing_agency_individual",
  [FIELDS.SERVICE]: "service_type",
  [FIELDS.SERVICE_RECORD_ID]: "unique_id"
});

export const SERVICE_SECTION_FIELDS_EXTERNAL = Object.freeze({
  [FIELDS.LOCATION]: "service_location",
  [FIELDS.AGENCY]: "service_implementing_agency_external",
  [FIELDS.TRANSITIONED_TO]: "service_provider",
  [FIELDS.TRANSITIONED_TO_REMOTE]: "service_provider",
  [FIELDS.SERVICE]: "service_type",
  [FIELDS.SERVICE_RECORD_ID]: "unique_id",
  [FIELDS.REMOTE]: SERVICE_EXTERNAL_REFERRAL
});

export const OMITTED_SUBMISSION_FIELDS = [FIELDS.LOCATION, FIELDS.ROLE];

export const TRANSITIONED_TO_ASYNC_FILTER_FIELDS = [
  FIELDS.SERVICE,
  [FIELDS.AGENCY, "agency"],
  [FIELDS.LOCATION, "location"]
];
