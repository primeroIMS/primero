// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export const TEXT_FIELD = "text_field";
export const TEXT_AREA = "textarea";
export const FORM_MODE_SHOW = "show";
export const FORM_MODE_EDIT = "edit";
export const FORM_MODE_NEW = "new";
export const FORM_MODE_DIALOG = "dialog";
export const NUMERIC_FIELD = "numeric_field";
export const SUBFORM_SECTION = "subform";
export const DATE_FIELD = "date_field";
export const SELECT_FIELD = "select_box";
export const TICK_FIELD = "tick_box";
export const CHECK_BOX_FIELD = "check_boxes";
export const LABEL_FIELD = "label";
export const SEPARATOR = "separator";
export const RADIO_FIELD = "radio_button";
export const TOGGLE_FIELD = "toggle_field";
export const PHOTO_RECORD_FIELD = "photo_upload_box";
export const DOCUMENT_RECORD_FIELD = "document_upload_box";
export const AUDIO_RECORD_FIELD = "audio_upload_box";
export const PHOTO_FIELD = "single_photo_upload_box";
export const DOCUMENT_FIELD = "single_document_upload_box";
export const AUDIO_FIELD = "single_audio_upload_box";
export const ERROR_FIELD = "error_field";
export const PARENT_FORM = "parent_form";
export const ORDERABLE_OPTIONS_FIELD = "orderable_options_field";
export const DIALOG_TRIGGER = "dialog_trigger";
export const HIDDEN_FIELD = "hidden";
export const LINK_FIELD = "link_field";
export const TALLY_FIELD = "tally_field";

export const OPTION_TYPES = {
  AGENCY: "Agency",
  AGENCY_CURRENT_USER: "AgencyCurrentUser",
  LOCATION: "Location",
  MODULE: "Module",
  USER_MODULE: "UserModule",
  FORM_GROUP: "FormGroup",
  LOOKUPS: "Lookups",
  USER: "User",
  REPORTING_LOCATIONS: "ReportingLocation",
  USER_GROUP: "UserGroup",
  USER_GROUP_PERMITTED: "UserGroupPermitted",
  INSIGHTS_USER_GROUP_PERMITTED: "InsightsUserGroupPermitted",
  ROLE: "Role",
  ROLE_PERMITTED: "RolePermitted",
  ROLE_EXTERNAL_REFERRAL: "RoleExternalReferral",
  ROLE_REFERRAL_AUTHORIZATION: "RoleReferralAuthorization",
  REFER_TO_USERS: "ReferToUsers",
  SERVICE_TYPE: "lookup-service-type",
  FORM_GROUP_LOOKUP: "FormGroupLookup",
  RECORD_FORMS: "RecordForms",
  MANAGED_ROLE_FORM_SECTIONS: "ManagedRoleFormSections",
  TRANSFER_TO_USERS: "TransferToUsers",
  LINKED_INCIDENTS: "LinkedIncidents"
};

export const CUSTOM_LOOKUPS = [
  OPTION_TYPES.USER,
  OPTION_TYPES.AGENCY,
  OPTION_TYPES.LOCATION,
  OPTION_TYPES.LINKED_INCIDENTS
];

export const SELECT_CHANGE_REASON = Object.freeze({
  removeOption: "removeOption",
  clear: "clear",
  blur: "blur",
  selectOption: "selectOption",
  createOption: "createOption"
});

export const EMPTY_VALUE = "--";
