import { RADIO_FIELD, SELECT_FIELD, LINK_TO_FORM } from "../record-form/constants";

const generateI18nPath = fieldName => `cases.summary.fields.${fieldName}`;

export const NAME = "SummaryForm";

export const fields = i18n => [
  {
    name: "consent_for_tracing",
    type: RADIO_FIELD,
    display_name: {
      [i18n.locale]: i18n.t(generateI18nPath("consent_for_tracing.label"))
    },
    visible: true,
    option_strings_source: "lookup-yes-no",
    help_text: { [i18n.locale]: i18n.t(generateI18nPath("consent_for_tracing.help_text")) }
  },
  {
    name: "data_confidentiality_link",
    type: LINK_TO_FORM,
    display_name: {
      [i18n.locale]: i18n.t(generateI18nPath("data_confidentiality_link.label"))
    },
    link_to_form: "consent",
    visible: true
  },
  {
    name: "wishes_child_family_tracing",
    type: RADIO_FIELD,
    display_name: {
      [i18n.locale]: i18n.t(generateI18nPath("wishes_child_family_tracing.label"))
    },
    visible: true,
    option_strings_source: "lookup-yes-no"
  },
  {
    name: "wishes_reunification",
    type: SELECT_FIELD,
    display_name: {
      [i18n.locale]: i18n.t(generateI18nPath("wishes_reunification.label"))
    },
    visible: true,
    option_strings_text: [
      { id: "yes_as_soon_as_possible", display_text: { [i18n.locale]: "Yes, as soon as possible" } },
      { id: "yes_but_later", display_text: { [i18n.locale]: "Yes, but later" } },
      { id: "not_sure", display_text: { [i18n.locale]: "Not sure" } },
      { id: "no", display_text: { [i18n.locale]: "No" } }
    ]
  },
  {
    name: "child_wishes_link",
    type: LINK_TO_FORM,
    display_name: {
      [i18n.locale]: i18n.t(`cases.summary.fields.child_wishes_link.label`)
    },
    link_to_form: "child_wishes",
    visible: true
  }
];
