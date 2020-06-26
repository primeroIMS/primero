import { fromJS } from "immutable";

import {
  FormSectionRecord,
  FieldRecord,
  TICK_FIELD,
  TEXT_FIELD,
  SELECT_FIELD,
  CHECK_BOX_FIELD
} from "../../../form";

import { ROLE_OPTIONS } from "./constants";

const sharedUserFields = (i18n, formMode) => [
  {
    display_name: i18n.t("user.full_name"),
    name: "full_name",
    type: "text_field",
    required: true,
    autoFocus: true
  },
  {
    display_name: i18n.t("user.user_name"),
    name: "user_name",
    type: TEXT_FIELD,
    required: true,
    editable: false
  },
  {
    display_name: i18n.t("user.code"),
    name: "code",
    type: TEXT_FIELD
  },
  {
    display_name: i18n.t("user.password"),
    name: "password",
    type: TEXT_FIELD,
    password: true,
    hideOnShow: true,
    required: formMode.get("isNew")
  },
  {
    display_name: i18n.t("user.password_confirmation"),
    name: "password_confirmation",
    type: TEXT_FIELD,
    password: true,
    hideOnShow: true,
    required: formMode.get("isNew")
  },
  {
    display_name: i18n.t("user.locale"),
    name: "locale",
    type: SELECT_FIELD,
    option_strings_text: i18n.applicationLocales.toJS()
  },
  {
    display_name: i18n.t("user.role_id"),
    name: "role_unique_id",
    type: SELECT_FIELD,
    required: true,
    option_strings_text: ROLE_OPTIONS
  },
  {
    display_name: i18n.t("user.user_group_unique_ids"),
    name: "user_group_unique_ids",
    type: CHECK_BOX_FIELD,
    required: true,
    option_strings_text: [
      { id: "usergroup-primero-cp", display_text: "Primero CP" },
      { id: "usergroup-primero-ftf", display_text: "Primero FTR" },
      { id: "usergroup-primero-gbv", display_text: "Primero GBV" }
    ]
  },
  {
    display_name: i18n.t("user.phone"),
    name: "phone",
    type: TEXT_FIELD
  },
  {
    display_name: i18n.t("user.email"),
    name: "email",
    required: true,
    type: TEXT_FIELD
  },
  {
    display_name: i18n.t("user.organization"),
    name: "agency_id",
    type: SELECT_FIELD,
    required: true,
    option_strings_source: "Agency"
  },
  {
    display_name: i18n.t("user.agency_office"),
    name: "agency_office",
    type: TEXT_FIELD
  },
  {
    display_name: i18n.t("user.position"),
    name: "position",
    type: TEXT_FIELD
  },
  {
    display_name: i18n.t("user.location"),
    name: "location",
    type: SELECT_FIELD,
    option_strings_source: "Location",
    required: true
  },
  {
    display_name: i18n.t("user.disabled"),
    name: "disabled",
    type: TICK_FIELD
  },
  {
    display_name: i18n.t("user.send_mail"),
    name: "send_mail",
    type: TICK_FIELD
  }
];

const IDENTITY_PROVIDER_ID = "identity_provider_id";

const identityUserFields = (i18n, identityOptions) => [
  {
    display_name: i18n.t("user.identity_provider"),
    name: IDENTITY_PROVIDER_ID,
    type: SELECT_FIELD,
    required: true,
    editable: false,
    option_strings_text: identityOptions
  }
];

const EXCLUDED_IDENITITY_FIELDS = ["password", "password_confirmation"];

// eslint-disable-next-line import/prefer-default-export
export const form = (
  i18n,
  formMode,
  useIdentityProviders,
  providers,
  identityOptions
) => {
  const useIdentity = useIdentityProviders && providers;
  const sharedFields = sharedUserFields(i18n, formMode);
  const identityFields = identityUserFields(i18n, identityOptions);

  const providersDisable = (value, name, { error }) => {
    const provider = providers
      ? providers.find(
          currentProvider => currentProvider.get("id") === parseInt(value, 10)
        )
      : null;

    return {
      ...(formMode.get("isShow") || {
        disabled: value === null || value === ""
      }),
      ...(name === "user_name" && {
        helperText:
          error?.message ||
          (provider
            ? i18n.t("user.provider_username_help", {
                domain: provider?.get("user_domain")
              })
            : null)
      })
    };
  };

  const formFields = [
    ...(useIdentity ? identityFields : []),
    ...sharedFields
  ].reduce((prev, field) => {
    if (!(useIdentity && EXCLUDED_IDENITITY_FIELDS.includes(field.name))) {
      const fieldProps = {
        ...field,
        ...(useIdentity &&
          field.name !== IDENTITY_PROVIDER_ID && {
            watchedInputs: IDENTITY_PROVIDER_ID,
            handleWatchedInputs: providersDisable
          })
      };

      prev.push(FieldRecord(fieldProps));
    }

    return prev;
  }, []);

  return fromJS([
    FormSectionRecord({
      unique_id: "users",
      fields: formFields
    })
  ]);
};
