import { fromJS } from "immutable";
import { object, number, string, lazy, ref, array, addMethod } from "yup";

import {
  FieldRecord,
  FormSectionRecord,
  TICK_FIELD,
  TEXT_FIELD,
  SELECT_FIELD,
  CHECK_BOX_FIELD
} from "../../../form";

import { ROLE_OPTIONS } from "./constants";

export const validations = (
  formMode,
  i18n,
  useIdentityProviders,
  providers
) => {
  const inputValidations = {
    agency_id: number().required().label(i18n.t("user.organization")),
    email: string().required().label(i18n.t("user.email")),
    full_name: string().required().label(i18n.t("user.full_name")),
    location: string().required().label(i18n.t("user.location")),
    role_unique_id: string().required().label(i18n.t("user.role_id")),
    user_group_unique_ids: array()
      .required()
      .label(i18n.t("user.user_group_unique_ids"))
  };

  if (useIdentityProviders && providers) {
    inputValidations.identity_provider_id = number().required();

    const isIdpProvider = (inputRef, message) => {
      return this.test("isIdpProvider", message, value => {
        const providerId = this.resolve(inputRef);
        const provider = providers.find(
          currentProvider =>
            currentProvider.get("id") === parseInt(providerId, 10)
        );

        if (provider) {
          const regexMatch = new RegExp(`@${provider.get("user_domain")}$`);

          return value.match(regexMatch);
        }
      });
    };

    addMethod(string, "isIdpProvider", isIdpProvider);

    inputValidations.user_name = string()
      .isIdpProvider(ref("identity_provider_id"))
      .required();
  } else {
    inputValidations.password = lazy(() => {
      const defaultValidation = string().min(8);

      if (formMode.get("isNew")) {
        return defaultValidation.required().label(i18n.t("user.password"));
      }

      return defaultValidation;
    });

    inputValidations.password_confirmation = lazy(() => {
      const defaultValidation = string().oneOf(
        [ref("password"), null],
        i18n.t("errors.models.user.password_mismatch")
      );

      if (formMode.get("isNew")) {
        return defaultValidation
          .required()
          .label(i18n.t("user.password_confirmation"));
      }

      return defaultValidation;
    });

    inputValidations.user_name = string()
      .required()
      .label(i18n.t("user.user_name"));
  }

  return object().shape(inputValidations);
};

export const form = (
  i18n,
  formMode,
  useIdentityProviders,
  providers,
  identityOptions
) => {
  let formData;

  if (useIdentityProviders && providers) {
    const providersDisable = input => {
      return input === null;
    };

    formData = {
      unique_id: "users",
      fields: [
        FieldRecord({
          display_name: i18n.t("user.identity_provider"),
          name: "identity_provider_id",
          type: SELECT_FIELD,
          disabled: true,
          required: true,
          editable: false,
          option_strings_text: identityOptions
        }),
        FieldRecord({
          display_name: i18n.t("user.full_name"),
          name: "full_name",
          type: "text_field",
          required: true,
          autoFocus: true,
          watchDisableInput: "identity_provider_id",
          watchDisable: providersDisable
        }),
        FieldRecord({
          display_name: i18n.t("user.user_name"),
          name: "user_name",
          disabled: true,
          type: TEXT_FIELD,
          required: true,
          editable: false,
          watchInput: "identity_provider_id",
          helpTextIfWatch: input => {
            const provider = providers
              ? providers.find(
                  currentProvider =>
                    currentProvider.get("id") === parseInt(input, 10)
                )
              : null;

            return provider
              ? i18n.t("user.provider_username_help", {
                  domain: provider.get("user_domain")
                })
              : null;
          },
          watchDisableInput: "identity_provider_id",
          watchDisable: providersDisable
        }),
        FieldRecord({
          display_name: i18n.t("user.code"),
          name: "code",
          type: TEXT_FIELD,
          watchDisableInput: "identity_provider_id",
          watchDisable: providersDisable
        }),
        FieldRecord({
          display_name: i18n.t("user.locale"),
          name: "locale",
          type: SELECT_FIELD,
          option_strings_text: i18n.applicationLocales.toJS(),
          watchDisableInput: "identity_provider_id",
          watchDisable: providersDisable
        }),
        FieldRecord({
          display_name: i18n.t("user.role_id"),
          name: "role_unique_id",
          type: SELECT_FIELD,
          required: true,
          option_strings_text: ROLE_OPTIONS,
          watchDisableInput: "identity_provider_id",
          watchDisable: providersDisable
        }),
        FieldRecord({
          display_name: i18n.t("user.user_group_unique_ids"),
          name: "user_group_unique_ids",
          type: CHECK_BOX_FIELD,
          required: true,
          option_strings_text: [
            { id: "usergroup-primero-cp", display_text: "Primero CP" },
            { id: "usergroup-primero-ftf", display_text: "Primero FTR" },
            { id: "usergroup-primero-gbv", display_text: "Primero GBV" }
          ],
          watchDisableInput: "identity_provider_id",
          watchDisable: providersDisable
        }),
        FieldRecord({
          display_name: i18n.t("user.phone"),
          name: "phone",
          type: TEXT_FIELD,
          watchDisableInput: "identity_provider_id",
          watchDisable: providersDisable
        }),
        FieldRecord({
          display_name: i18n.t("user.email"),
          name: "email",
          required: true,
          type: TEXT_FIELD,
          watchDisableInput: "identity_provider_id",
          watchDisable: providersDisable
        }),
        FieldRecord({
          display_name: i18n.t("user.organization"),
          name: "agency_id",
          type: SELECT_FIELD,
          required: true,
          option_strings_text: [{ id: "1", display_text: "UNICEF" }],
          watchDisableInput: "identity_provider_id",
          watchDisable: providersDisable
        }),
        FieldRecord({
          display_name: i18n.t("user.agency_office"),
          name: "agency_office",
          type: TEXT_FIELD,
          watchDisableInput: "identity_provider_id",
          watchDisable: providersDisable
        }),
        FieldRecord({
          display_name: i18n.t("user.position"),
          name: "position",
          type: TEXT_FIELD,
          watchDisableInput: "identity_provider_id",
          watchDisable: providersDisable
        }),
        FieldRecord({
          display_name: i18n.t("user.location"),
          name: "location",
          type: SELECT_FIELD,
          option_strings_source: "Location",
          watchDisableInput: "identity_provider_id",
          watchDisable: providersDisable,
          required: true
        }),
        FieldRecord({
          display_name: i18n.t("user.disabled"),
          name: "disabled",
          type: TICK_FIELD,
          watchDisableInput: "identity_provider_id",
          watchDisable: providersDisable
        }),
        FieldRecord({
          display_name: i18n.t("user.send_mail"),
          name: "send_mail",
          type: TICK_FIELD,
          watchDisableInput: "identity_provider_id",
          watchDisable: providersDisable
        })
      ]
    };
  } else {
    formData = {
      unique_id: "users",
      fields: [
        FieldRecord({
          display_name: i18n.t("user.full_name"),
          name: "full_name",
          type: "text_field",
          required: true,
          autoFocus: true
        }),
        FieldRecord({
          display_name: i18n.t("user.user_name"),
          name: "user_name",
          disabled: true,
          type: TEXT_FIELD,
          required: true,
          editable: false
        }),
        FieldRecord({
          display_name: i18n.t("user.code"),
          name: "code",
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("user.password"),
          name: "password",
          type: TEXT_FIELD,
          password: true,
          hideOnShow: true,
          required: formMode.get("isNew")
        }),
        FieldRecord({
          display_name: i18n.t("user.password_confirmation"),
          name: "password_confirmation",
          type: TEXT_FIELD,
          password: true,
          hideOnShow: true,
          required: formMode.get("isNew")
        }),
        FieldRecord({
          display_name: i18n.t("user.locale"),
          name: "locale",
          type: SELECT_FIELD,
          option_strings_text: i18n.applicationLocales.toJS()
        }),
        FieldRecord({
          display_name: i18n.t("user.role_id"),
          name: "role_unique_id",
          type: SELECT_FIELD,
          required: true,
          option_strings_text: ROLE_OPTIONS
        }),
        FieldRecord({
          display_name: i18n.t("user.user_group_unique_ids"),
          name: "user_group_unique_ids",
          type: CHECK_BOX_FIELD,
          required: true,
          option_strings_text: [
            { id: "usergroup-primero-cp", display_text: "Primero CP" },
            { id: "usergroup-primero-ftf", display_text: "Primero FTR" },
            { id: "usergroup-primero-gbv", display_text: "Primero GBV" }
          ]
        }),
        FieldRecord({
          display_name: i18n.t("user.phone"),
          name: "phone",
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("user.email"),
          name: "email",
          required: true,
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("user.organization"),
          name: "agency_id",
          type: SELECT_FIELD,
          required: true,
          option_strings_source: "Agency"
        }),
        FieldRecord({
          display_name: i18n.t("user.agency_office"),
          name: "agency_office",
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("user.position"),
          name: "position",
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("user.location"),
          name: "location",
          type: SELECT_FIELD,
          option_strings_source: "Location",
          required: true
        }),
        FieldRecord({
          display_name: i18n.t("user.disabled"),
          name: "disabled",
          type: TICK_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("user.send_mail"),
          name: "send_mail",
          type: TICK_FIELD
        })
      ]
    };
  }

  return fromJS([FormSectionRecord(formData)]);
};
