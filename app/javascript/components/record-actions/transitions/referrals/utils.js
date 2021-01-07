import { SELECT_FIELD, OPTION_TYPES, TEXT_FIELD, DATE_FIELD } from "../../../form";

import { FIELDS, SERVICE_SECTION_FIELDS_EXTERNAL, SERVICE_SECTION_FIELDS } from "./constants";

export const mapServiceFields = (serviceToRefer, isExternalReferralFromService) => {
  const servicesFields = isExternalReferralFromService ? SERVICE_SECTION_FIELDS_EXTERNAL : SERVICE_SECTION_FIELDS;

  return Object.keys(servicesFields).reduce((prev, key) => {
    const obj = prev;
    const serviceValue = serviceToRefer.get(servicesFields[key], false);

    if (serviceValue) {
      obj[key] = serviceValue;
    }

    return obj;
  }, {});
};

export const customReferralFormProps = i18n => {
  return {
    condition: FIELDS.REMOTE,
    fields: [
      {
        name: "date",
        display_name: i18n.t("referral.date"),
        type: DATE_FIELD,
        date_include_time: true,
        visible: true,
        defaultValue: new Date()
      },
      {
        name: FIELDS.SERVICE,
        display_name: i18n.t("referral.service_label"),
        type: SELECT_FIELD,
        option_strings_source: OPTION_TYPES.SERVICE_TYPE,
        visible: true
      },
      {
        name: FIELDS.AGENCY,
        display_name: i18n.t("referral.agency_label"),
        visible: true,
        type: TEXT_FIELD
      },
      {
        name: FIELDS.LOCATION,
        display_name: i18n.t("referral.location_label"),
        visible: true,
        type: TEXT_FIELD
      },
      {
        name: FIELDS.TRANSITIONED_TO_REMOTE,
        display_name: i18n.t("referral.recipient_label"),
        visible: true,
        type: TEXT_FIELD
      },
      {
        name: FIELDS.NOTES,
        display_name: i18n.t("referral.notes_label"),
        visible: true,
        type: TEXT_FIELD
      }
    ]
  };
};
