import { fromJS } from "immutable";

import { GROUP_PERMISSIONS } from "../../../../libs/permissions";
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
  USERGROUP_PRIMERO_GBV
} from "./constants";

const passwordPlaceholder = formMode => (formMode.get("isEdit") ? "•••••" : "");

const sharedUserFields = (
  i18n,
  formMode,
  hideOnAccountPage,
  onClickChangePassword,
  useIdentity,
  { currentUserGroupPermissions = [], agencyReadOnUsers, currentRoleGroupPermission }
) => [
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
    display_name: i18n.t("user.password_setting.label"),
    name: "password_setting",
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
    name: "password",
    type: TEXT_FIELD,
    password: true,
    hideOnShow: true,
    required: formMode.get("isNew"),
    editable: false,
    placeholder: passwordPlaceholder(formMode),
    watchedInputs: "password_setting",
    handleWatchedInputs: value => ({
      visible: value === PASSWORD_SELF_OPTION || !formMode.get("isNew")
    })
  },
  {
    display_name: i18n.t("user.password_confirmation"),
    name: "password_confirmation",
    type: TEXT_FIELD,
    password: true,
    hideOnShow: true,
    required: formMode.get("isNew"),
    editable: false,
    placeholder: passwordPlaceholder(formMode),
    watchedInputs: "password_setting",
    handleWatchedInputs: value => ({
      visible: value === PASSWORD_SELF_OPTION || !formMode.get("isNew")
    })
  },
  {
    name: "change_password",
    display_name: i18n.t("buttons.change_password"),
    type: DIALOG_TRIGGER,
    hideOnShow: true,
    showIf: () => formMode.get("isEdit") && !useIdentity,
    onClick: onClickChangePassword
  },
  {
    display_name: i18n.t("user.language"),
    name: "locale",
    type: SELECT_FIELD,
    option_strings_text: i18n.applicationLocales
  },
  {
    display_name: i18n.t("user.role_id"),
    name: "role_unique_id",
    type: SELECT_FIELD,
    required: true,
    option_strings_source: OPTION_TYPES.ROLE,
    visible: !hideOnAccountPage
  },
  {
    display_name: i18n.t("user.user_group_unique_ids"),
    name: "user_group_unique_ids",
    type: SELECT_FIELD,
    multi_select: true,
    required: true,
    option_strings_source: OPTION_TYPES.USER_GROUP,
    visible: !hideOnAccountPage,
    watchedInputs: ["user_group_unique_ids"],
    filterOptionSource: (_watchedInputValues, options) => {
      return options.map(userGroup => {
        if (!currentUserGroupPermissions.includes(userGroup.id)) {
          return {
            ...userGroup,
            disabled: currentRoleGroupPermission !== GROUP_PERMISSIONS.ALL
          };
        }

        return userGroup;
      });
    }
  },
  {
    display_name: i18n.t("user.services"),
    name: "services",
    type: SELECT_FIELD,
    multi_select: true,
    option_strings_source: "lookup-service-type",
    help_text: formMode.get("isNew") ? i18n.t("user.services_help_text") : ""
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
    display_name: i18n.t("user.agency"),
    name: "agency_id",
    type: SELECT_FIELD,
    required: true,
    option_strings_source: agencyReadOnUsers ? OPTION_TYPES.AGENCY_CURRENT_USER : OPTION_TYPES.AGENCY,
    watchedInputs: ["agency_id"],
    visible: !hideOnAccountPage
  },
  {
    display_name: i18n.t("user.agency_office"),
    name: "agency_office",
    type: SELECT_FIELD,
    option_strings_source: "lookup-agency-office",
    watchedInputs: USER_GROUP_UNIQUE_IDS,
    handleWatchedInputs: value => ({
      visible: !hideOnAccountPage && value?.includes(USERGROUP_PRIMERO_GBV)
    })
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
    option_strings_source: OPTION_TYPES.LOCATION,
    required: true
  },
  {
    display_name: i18n.t("user.disabled"),
    name: "disabled",
    type: TICK_FIELD,
    visible: !hideOnAccountPage
  },
  {
    display_name: i18n.t("user.send_mail"),
    name: "send_mail",
    type: TICK_FIELD,
    selected_value: formMode.get("isNew")
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

const EXCLUDED_IDENITITY_FIELDS = ["password", "password_confirmation", "password_setting", "change_password"];

// eslint-disable-next-line import/prefer-default-export
export const form = (
  i18n,
  formMode,
  useIdentityProviders,
  providers,
  identityOptions,
  onClickChangePassword,
  hideOnAccountPage = false,
  { agencyReadOnUsers, currentUserGroupPermissions, currentRoleGroupPermission } = {}
) => {
  const useIdentity = useIdentityProviders && providers;
  const sharedFields = sharedUserFields(i18n, formMode, hideOnAccountPage, onClickChangePassword, useIdentity, {
    currentUserGroupPermissions,
    agencyReadOnUsers,
    currentRoleGroupPermission
  });
  const identityFields = identityUserFields(i18n, identityOptions);

  const providersDisable = (value, name, { error }) => {
    const provider = providers ? providers.find(currentProvider => currentProvider.get("unique_id") === value) : null;

    return {
      ...(formMode.get("isShow") || {
        disabled: value === null || value === "" || (name === "user_name" && !formMode.get("isNew"))
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
