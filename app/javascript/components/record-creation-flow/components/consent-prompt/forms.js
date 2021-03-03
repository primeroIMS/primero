/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";

import { FieldRecord, FormSectionRecord, CHECK_BOX_FIELD } from "../../../form";
import { displayNameHelper } from "../../../../libs";

const buildConsentAgreementFields = (i18n, consentAgreementFields = []) => {
  const fields = consentAgreementFields.map((field, index) => {
    return {
      id: field.name,
      display_name: displayNameHelper(field.display_name, i18n.locale),
      includeSeparator: index !== 0
    };
  });

  return fields;
};

const buildLegitimateFields = (legitimateBasisLookup, legitimateBasisExplanationsLookup) => {
  const fields = legitimateBasisLookup.map((legitimateBasis, index) => {
    const legitimateBasisId = legitimateBasis.get("id");
    const legitimateBasisText = legitimateBasis.get("display_text");
    const legitimateBasisExplanation = legitimateBasisExplanationsLookup
      .find(explanation => explanation.get("id") === legitimateBasisId)
      ?.get("display_text");

    const boldText = `${legitimateBasisText}:`;
    const displayName = legitimateBasisExplanation ? `${boldText} ${legitimateBasisExplanation}` : legitimateBasisText;

    return {
      id: legitimateBasisId,
      display_name: displayName,
      boldText,
      includeSeparator: index !== 0
    };
  });

  return fields?.toJS();
};

export const consentPromptForm = (
  i18n,
  {
    renderConsentAgreementField,
    renderLegitimateField,
    consentAgreementFields,
    legitimateBasisLookup,
    legitimateBasisExplanationsLookup
  }
) =>
  fromJS([
    FormSectionRecord({
      unique_id: "consent_form",
      fields: [
        FieldRecord({
          display_name: i18n.t("case.consent_agreements"),
          name: "consent_agreements",
          type: CHECK_BOX_FIELD,
          visible: renderConsentAgreementField,
          option_strings_text: buildConsentAgreementFields(i18n, consentAgreementFields)
        }),
        FieldRecord({
          display_name: i18n.t("case.legitimate_basis"),
          name: "legitimate_basis",
          type: CHECK_BOX_FIELD,
          visible: renderLegitimateField,
          option_strings_text: buildLegitimateFields(legitimateBasisLookup, legitimateBasisExplanationsLookup)
        })
      ]
    })
  ]);
