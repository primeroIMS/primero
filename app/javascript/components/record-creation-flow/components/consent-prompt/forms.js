/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";

import { FieldRecord, FormSectionRecord, LABEL_FIELD, SEPARATOR, TICK_FIELD } from "../../../form";
import { displayNameHelper } from "../../../../libs";

const separator = name => FieldRecord({ type: SEPARATOR, name });

const includeSeparators = data =>
  data.reduce((acc, curr, index) => {
    const separatorName = Math.floor(Math.random() * 100000).toString();

    if (index !== 0) {
      return [...acc, separator(separatorName), curr];
    }

    return [...acc, curr];
  }, []);

const buildConsentAgreementFields = (css, i18n, consentAgreementFields = []) => {
  const fields = consentAgreementFields.map(field => {
    return FieldRecord({
      display_name: displayNameHelper(field.display_name, i18n.locale),
      name: field.name,
      type: TICK_FIELD
    });
  });

  return includeSeparators(fields);
};

const buildLegitimateFields = (css, i18n, legitimateBasisLookup, legitimateBasisExplanationsLookup) => {
  const fields = legitimateBasisLookup.map(legitimateBasis => {
    const legitimateBasisId = legitimateBasis.get("id");
    const legitimateBasisText = legitimateBasis.get("display_text");
    const legitimateBasisExplanation = legitimateBasisExplanationsLookup
      .find(explanation => explanation.get("id") === legitimateBasisId)
      ?.get("display_text");

    const boldText = `${legitimateBasisText}:`;
    const displayName = legitimateBasisExplanation ? `${boldText} ${legitimateBasisExplanation}` : legitimateBasisText;

    return FieldRecord({
      display_name: displayName,
      name: `legitimate_basis.${legitimateBasisId}`,
      type: TICK_FIELD,
      boldText
    });
  });

  return includeSeparators(fields);
};

export const consentPromptForm = (
  css,
  i18n,
  { consentAgreementFields, legitimateBasisLookup, legitimateBasisExplanationsLookup }
) =>
  fromJS([
    FormSectionRecord({
      unique_id: "consent_form",
      fields: [
        FieldRecord({
          display_name: "Select all consent agreements that apply",
          name: "consent_agreements_label",
          type: LABEL_FIELD,
          inputClassname: css.consentLabel
        }),
        ...buildConsentAgreementFields(css, i18n, consentAgreementFields),
        FieldRecord({
          display_name: "Select all legitimate basis clasifications that apply",
          name: "consent_legitimate_basis_label",
          type: LABEL_FIELD,
          inputClassname: css.consentLabel
        }),
        ...buildLegitimateFields(css, i18n, legitimateBasisLookup, legitimateBasisExplanationsLookup)
      ]
    })
  ]);
