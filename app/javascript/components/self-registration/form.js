// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { boolean, object, string } from "yup";

import { FieldRecord, FormSectionRecord, HIDDEN_FIELD, SELECT_FIELD, TEXT_FIELD, TICK_FIELD } from "../form";

export const validationSchema = i18n =>
  object().shape({
    data_processing_consent_provided: boolean()
      .required()
      .oneOf([true], i18n.t("self_registration.data_processing_consent_required")),
    email: string().required().email().label(i18n.t("user.email")),
    full_name: string().required().label(i18n.t("user.full_name"))
  });

export const form = ({ i18n, registrationStreamsConsentText, stream }) => {
  return fromJS([
    FormSectionRecord({
      unique_id: "login",
      fields: [
        FieldRecord({
          display_name: i18n.t("user.email"),
          name: "email",
          type: TEXT_FIELD,
          help_text: i18n.t("self_registration.user_name_help_text"),
          required: true
        }),
        FieldRecord({
          display_name: i18n.t("user.full_name"),
          name: "full_name",
          type: TEXT_FIELD,
          required: true,
          autoFocus: true
        }),
        FieldRecord({
          display_name: i18n.t("self_registration.locale"),
          name: "locale",
          type: i18n.applicationLocales?.length > 1 ? SELECT_FIELD : HIDDEN_FIELD,
          option_strings_text: i18n.applicationLocales,
          required: false
        }),
        FieldRecord({
          display_name: i18n.t("user.send_mail"),
          name: "send_mail",
          type: TICK_FIELD,
          required: false
        }),
        FieldRecord({
          display_name: registrationStreamsConsentText.getIn([i18n.locale, stream]),
          name: "data_processing_consent_provided",
          type: TICK_FIELD,
          required: false
        })
      ]
    })
  ]);
};
