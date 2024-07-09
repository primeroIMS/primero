// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export const ATTACHMENT_FIELD_NAME = "AttachmentField";
export const DATE_FIELD_NAME = "DateField";
export const DOCUMENT_FIELD_NAME = "DocumentField";
export const FORM_SECTION_FIELD_NAME = "FormSectionField";
export const RADIO_FIELD_NAME = "RadioField";
export const RECORD_FORM_TOOLBAR_NAME = "RecordFormToolbar";
export const RECORD_FORM_TOOLBAR_PAGE_HEADING_NAME = `${RECORD_FORM_TOOLBAR_NAME}PageHeading`;
export const RECORD_FORM_NAME = "RecordForm";
export const SELECT_FIELD_NAME = "SelectField";
export const SEPERATOR_NAME = "Seperator";
export const TEXT_FIELD_NAME = "TextField";
export const TICK_FIELD_NAME = "TickField";
export const TALLY_FIELD_NAME = "TallyField";
export const TALLY_FIELD_CONTAINER_NAME = "TallyFieldContainer";
export const CUSTOM_STRINGS_SOURCE = {
  agency: "Agency",
  location: "Location",
  reportingLocation: "ReportingLocation",
  user: "User"
};
export const RECORD_FORM_PERMISSION = {
  read: "r",
  readWrite: "rw"
};

export const VIOLATION_ASSOCIATIONS_SUBFORM = [
  "individual_victims",
  "perpetrators",
  "group_victims",
  "sources",
  "responses"
];

export const ASYNC_OPTIONS = [CUSTOM_STRINGS_SOURCE.agency, CUSTOM_STRINGS_SOURCE.user];
