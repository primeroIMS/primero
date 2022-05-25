/* eslint-disable import/prefer-default-export */

import { TALLY_FIELD, SEPERATOR, TEXT_AREA, DATE_FIELD, SELECT_FIELD } from "../record-form/constants";

import { FIELD_NAMES } from "./constants";

const generateI18nPath = fieldName => `incidents.summary_mrm.fields.${fieldName}`;

export const fields = i18n => [
  {
    name: FIELD_NAMES.summary_of_incident,
    type: SEPERATOR,
    display_name: {
      [i18n.locale]: i18n.t(generateI18nPath("summary_of_incident.label"))
    },
    visible: true
  },
  {
    name: FIELD_NAMES.incident_total_tally,
    type: TALLY_FIELD,
    display_name: {
      [i18n.locale]: i18n.t(generateI18nPath("incident_total_tally.label"))
    },
    visible: true,
    autosum_total: true,
    tally: [
      {
        id: "boys",
        display_text: { [i18n.locale]: i18n.t(generateI18nPath("incident_total_tally.boys")) }
      },
      {
        id: "girls",
        display_text: { [i18n.locale]: i18n.t(generateI18nPath("incident_total_tally.girls")) }
      },
      {
        id: "unknown",
        display_text: { [i18n.locale]: i18n.t(generateI18nPath("incident_total_tally.unknown")) }
      }
    ]
  },
  {
    name: FIELD_NAMES.incident_date,
    type: DATE_FIELD,
    display_name: {
      [i18n.locale]: i18n.t(generateI18nPath("incident_date.label"))
    },
    visible: true,
    disabled: true
  },
  {
    name: FIELD_NAMES.incident_location,
    type: SELECT_FIELD,
    display_name: {
      [i18n.locale]: i18n.t(generateI18nPath("incident_location.label"))
    },
    visible: true,
    disabled: true,
    option_strings_source: "Location"
  },
  {
    name: FIELD_NAMES.incident_description,
    type: TEXT_AREA,
    display_name: {
      [i18n.locale]: i18n.t(generateI18nPath("incident_description.label"))
    },
    visible: true,
    disabled: true
  },
  {
    name: FIELD_NAMES.incident_update,
    type: TEXT_AREA,
    display_name: {
      [i18n.locale]: i18n.t(generateI18nPath("incident_update.label"))
    },
    visible: true,
    disabled: true
  }
];
