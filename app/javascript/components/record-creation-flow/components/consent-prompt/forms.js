/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";

import { FieldRecord, FormSectionRecord, LABEL_FIELD, SEPARATOR, TICK_FIELD } from "../../../form";
import { displayNameHelper } from "../../../../libs";

const buildConsentAgreementFields = (i18n, legitimateFields = []) => {
  return legitimateFields.map(field =>
    FieldRecord({
      display_name: displayNameHelper(field.display_name, i18n.locale),
      name: field.name,
      type: TICK_FIELD
    })
  );
};

const buildLegitimateFields = () => {
  return [
    FieldRecord({
      display_name: "TEST AGREEMENT FIELD 1",
      name: "test_agreement_field_1",
      type: LABEL_FIELD
    }),
    FieldRecord({
      type: SEPARATOR
    }),
    FieldRecord({
      display_name: "TEST AGREEMENT FIELD 2",
      name: "test_agreement_field_2",
      type: LABEL_FIELD
    })
  ];
};

export const consentPromptForm = (i18n, { legitimateFields }) =>
  fromJS([
    FormSectionRecord({
      unique_id: "consent_form",
      fields: [
        FieldRecord({
          display_name: "Select all consent agreements that apply",
          name: "consent_agreements_label",
          type: LABEL_FIELD
        }),
        ...buildConsentAgreementFields(i18n, legitimateFields),
        FieldRecord({
          display_name: "Select all legitimate basis clasifications that apply",
          name: "consent_legitimate_basis_label",
          type: LABEL_FIELD
        }),
        ...buildLegitimateFields()
      ]
    })
  ]);
