import { fromJS } from "immutable";

import { LOOKUPS } from "../../../../config";
import { GROUP_PERMISSIONS } from "../../../permissions";
import {
  FormSectionRecord,
  FieldRecord,
  DIALOG_TRIGGER,
  TICK_FIELD,
  TEXT_FIELD,
  SELECT_FIELD,
  OPTION_TYPES
} from "../../../form";

import {
  IDENTITY_PROVIDER_ID,
  PASSWORD_SELF_OPTION,
  PASSWORD_USER_OPTION,
  USER_GROUP_UNIQUE_IDS,
  USERGROUP_PRIMERO_GBV,
  FIELD_NAMES
} from "./constants";

const passwordPlaceholder = formMode => (formMode.get("isEdit") ? "•••••" : "");

const sharedUserFields = (
  i18n,
  formMode,
  hideOnAccountPage,
  onClickChangePassword,
  useIdentity,
  { agencyReadOnUsers, currentRoleGroupPermission, userGroups }
) => [
  {
    display_name: i18n.t("user.full_name"),
    name: FIELD_NAMES.FULL_NAME,
    type: "text_field",
    required: true,
    autoFocus: true
  },
  {
    display_name: i18n.t("user.user_name"),
    name: FIELD_NAMES.USER_NAME,
    type: TEXT_FIELD,
    required: true,
    editable: false
  },
  {
    display_name: i18n.t("user.code"),
    name: FIELD_NAMES.CODE,
    type: TEXT_FIELD
  },
  {
    display_name: i18n.t("user.password_setting.label"),
    name: FIELD_NAMES.PASSWORD_SETTING,
    type: SELECT_FIELD,
    hideOnShow: true,
    required: formMode.get("isNew"),
    visible: formMode.get("isNew"),
    help_text: i18n.t("user.password_setting.help_text"),
    option_strings_text: [
      { id: PASSWORD_SELF_OPTION, display_text: i18n.t("user.password_setting.self") },
      { id: PASSWORD_USER_OPTION, display_text: i18n.t("user.password_setting.user") }
    ]
  },
  {
    display_name: i18n.t("user.password"),
    name: FIELD_NAMES.PASSWORD,
    type: TEXT_FIELD,
    password: true,
    hideOnShow: true,
    required: formMode.get("isNew"),
    editable: false,
    placeholder: passwordPlaceholder(formMode),
    watchedInputs: FIELD_NAMES.PASSWORD_SETTING,
    handleWatchedInputs: value => ({
      visible: value === PASSWORD_SELF_OPTION || !formMode.get("isNew")
    })
  },
  {
    display_name: i18n.t("user.password_confirmation"),
    name: FIELD_NAMES.PASSWORD_CONFIRMATION,
    type: TEXT_FIELD,
    password: true,
    hideOnShow: true,
    required: formMode.get("isNew"),
    editable: false,
    placeholder: passwordPlaceholder(formMode),
    watchedInputs: FIELD_NAMES.PASSWORD_SETTING,
    handleWatchedInputs: value => ({
      visible: value === PASSWORD_SELF_OPTION || !formMode.get("isNew")
    })
  },
  {
    name: FIELD_NAMES.CHANGE_PASSWORD,
    display_name: i18n.t("buttons.change_password"),
    type: DIALOG_TRIGGER,
    hideOnShow: true,
    showIf: () => formMode.get("isEdit") && !useIdentity,
    onClick: onClickChangePassword
  },
  {
    display_name: i18n.t("user.language"),
    name: FIELD_NAMES.LOCALE,
    type: SELECT_FIELD,
    option_strings_text: i18n.applicationLocales
  },
  {
    display_name: i18n.t("user.role_id"),
    name: FIELD_NAMES.ROLE_UNIQUE_ID,
    type: SELECT_FIELD,
    required: true,
    option_strings_source: OPTION_TYPES.ROLE_PERMITTED,
    watchedInputs: [FIELD_NAMES.ROLE_UNIQUE_ID],
    editable: !hideOnAccountPage
  },
  {
    display_name: i18n.t("user.user_group_unique_ids"),
    name: FIELD_NAMES.USER_GROUP_UNIQUE_IDS,
    type: SELECT_FIELD,
    multi_select: true,
    required: true,
    ...(userGroups?.size
      ? {
          option_strings_text: userGroups.map(userGroup => ({
            id: userGroup.get("unique_id"),
            display_text: userGroup.get("name")
          }))
        }
      : { option_strings_source: OPTION_TYPES.USER_GROUP_PERMITTED }),
    editable: !hideOnAccountPage,
    watchedInputs: [FIELD_NAMES.USER_GROUP_UNIQUE_IDS]
  },
  {
    display_name: i18n.t("user.services"),
    name: FIELD_NAMES.SERVICES,
    type: SELECT_FIELD,
    multi_select: true,
    option_strings_source: LOOKUPS.service_type,
    help_text: formMode.get("isNew") ? i18n.t("user.services_help_text") : ""
  },
  {
    display_name: i18n.t("user.phone"),
    name: FIELD_NAMES.PHONE,
    type: TEXT_FIELD
  },
  {
    display_name: i18n.t("user.email"),
    name: FIELD_NAMES.EMAIL,
    required: true,
    type: TEXT_FIELD
  },
  {
    display_name: i18n.t("user.agency"),
    name: FIELD_NAMES.AGENCY_ID,
    type: SELECT_FIELD,
    required: true,
    option_strings_source:
      agencyReadOnUsers || currentRoleGroupPermission !== GROUP_PERMISSIONS.ALL
        ? OPTION_TYPES.AGENCY_CURRENT_USER
        : OPTION_TYPES.AGENCY,
    watchedInputs: [FIELD_NAMES.AGENCY_ID],
    visible: !hideOnAccountPage
  },
  {
    display_name: i18n.t("user.agency_office"),
    name: FIELD_NAMES.AGENCY_OFFICE,
    type: SELECT_FIELD,
    option_strings_source: LOOKUPS.agency_office,
    watchedInputs: USER_GROUP_UNIQUE_IDS,
    handleWatchedInputs: value => ({
      visible: !hideOnAccountPage && value?.includes(USERGROUP_PRIMERO_GBV)
    })
  },
  {
    display_name: i18n.t("user.position"),
    name: FIELD_NAMES.POSITION,
    type: TEXT_FIELD
  },
  {
    display_name: i18n.t("user.location"),
    name: FIELD_NAMES.LOCATION,
    type: SELECT_FIELD,
    option_strings_source: OPTION_TYPES.LOCATION,
    required: true
  },
  {
    display_name: i18n.t("user.disabled"),
    name: FIELD_NAMES.DISABLED,
    type: TICK_FIELD,
    visible: !hideOnAccountPage
  },
  {
    display_name: i18n.t("user.send_mail"),
    name: FIELD_NAMES.SEND_MAIL,
    type: TICK_FIELD,
    selected_value: formMode.get("isNew")
  },
  {
    display_name: i18n.t("user.receive_webpush.label"),
    name: FIELD_NAMES.RECEIVE_WEBPUSH,
    type: TICK_FIELD,
    help_text: i18n.t("user.receive_webpush.help_text")
  }
];

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

const EXCLUDED_IDENITITY_FIELDS = [
  FIELD_NAMES.PASSWORD,
  FIELD_NAMES.PASSWORD_CONFIRMATION,
  FIELD_NAMES.PASSWORD_SETTING,
  FIELD_NAMES.CHANGE_PASSWORD
];

// eslint-disable-next-line import/prefer-default-export
export const form = (
  i18n,
  formMode,
  useIdentityProviders,
  providers,
  identityOptions,
  onClickChangePassword,
  hideOnAccountPage = false,
  { agencyReadOnUsers, currentRoleGroupPermission, userGroups } = {}
) => {
  const useIdentity = useIdentityProviders && providers;
  const sharedFields = sharedUserFields(i18n, formMode, hideOnAccountPage, onClickChangePassword, useIdentity, {
    agencyReadOnUsers,
    currentRoleGroupPermission,
    userGroups
  });
  const identityFields = identityUserFields(i18n, identityOptions);

  const providersDisable = (value, name, { error }) => {
    const provider = providers ? providers.find(currentProvider => currentProvider.get("unique_id") === value) : null;

    return {
      ...(formMode.get("isShow") || {
        disabled: value === null || value === "" || (name === FIELD_NAMES.USER_NAME && !formMode.get("isNew"))
      }),
      ...(name === FIELD_NAMES.USER_NAME && {
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

  const formFields = [...(useIdentity ? identityFields : []), ...sharedFields].reduce((prev, field) => {
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
