import {
  FieldRecord,
  TICK_FIELD,
  TEXT_FIELD,
  SELECT_FIELD,
  CHECK_BOX_FIELD
} from "../../../../form";
import { ROLE_OPTIONS } from "../constants";

const IDENTITY_PROVIDER_ID = "identity_provider_id";

export default ({ i18n, identityOptions, providersDisable, providers }) => ({
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
      watchedInputs: IDENTITY_PROVIDER_ID,
      handleWatchedInputs: providersDisable
    }),
    FieldRecord({
      display_name: i18n.t("user.user_name"),
      name: "user_name",
      disabled: true,
      type: TEXT_FIELD,
      required: true,
      editable: false,
      watchedInputs: IDENTITY_PROVIDER_ID,
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
      watchedInputs: IDENTITY_PROVIDER_ID,
      watchDisable: providersDisable
    }),
    FieldRecord({
      display_name: i18n.t("user.locale"),
      name: "locale",
      type: SELECT_FIELD,
      option_strings_text: i18n.applicationLocales.toJS(),
      watchedInputs: IDENTITY_PROVIDER_ID,
      watchDisable: providersDisable
    }),
    FieldRecord({
      display_name: i18n.t("user.role_id"),
      name: "role_unique_id",
      type: SELECT_FIELD,
      required: true,
      option_strings_text: ROLE_OPTIONS,
      watchedInputs: IDENTITY_PROVIDER_ID,
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
      watchedInputs: IDENTITY_PROVIDER_ID,
      watchDisable: providersDisable
    }),
    FieldRecord({
      display_name: i18n.t("user.phone"),
      name: "phone",
      type: TEXT_FIELD,
      watchedInputs: IDENTITY_PROVIDER_ID,
      watchDisable: providersDisable
    }),
    FieldRecord({
      display_name: i18n.t("user.email"),
      name: "email",
      required: true,
      type: TEXT_FIELD,
      watchedInputs: IDENTITY_PROVIDER_ID,
      watchDisable: providersDisable
    }),
    FieldRecord({
      display_name: i18n.t("user.organization"),
      name: "agency_id",
      type: SELECT_FIELD,
      required: true,
      option_strings_source: "Agency",
      watchedInputs: IDENTITY_PROVIDER_ID,
      watchDisable: providersDisable
    }),
    FieldRecord({
      display_name: i18n.t("user.agency_office"),
      name: "agency_office",
      type: TEXT_FIELD,
      watchedInputs: IDENTITY_PROVIDER_ID,
      watchDisable: providersDisable
    }),
    FieldRecord({
      display_name: i18n.t("user.position"),
      name: "position",
      type: TEXT_FIELD,
      watchedInputs: IDENTITY_PROVIDER_ID,
      watchDisable: providersDisable
    }),
    FieldRecord({
      display_name: i18n.t("user.location"),
      name: "location",
      type: SELECT_FIELD,
      option_strings_source: "Location",
      watchedInputs: IDENTITY_PROVIDER_ID,
      watchDisable: providersDisable,
      required: true
    }),
    FieldRecord({
      display_name: i18n.t("user.disabled"),
      name: "disabled",
      type: TICK_FIELD,
      watchedInputs: IDENTITY_PROVIDER_ID,
      watchDisable: providersDisable
    }),
    FieldRecord({
      display_name: i18n.t("user.send_mail"),
      name: "send_mail",
      type: TICK_FIELD,
      watchedInputs: IDENTITY_PROVIDER_ID,
      watchDisable: providersDisable
    })
  ]
});
