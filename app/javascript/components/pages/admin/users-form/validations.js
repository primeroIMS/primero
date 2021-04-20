import { object, number, string, ref, array, addMethod } from "yup";

import { PASSWORD_MIN_LENGTH } from "../../../../config";

import { PASSWORD_SELF_OPTION } from "./constants";

export default (formMode, i18n, useIdentityProviders, providers, isMyAccountPage = false) => {
  const useProviders = useIdentityProviders && providers;

  // eslint-disable-next-line func-names
  const isIdpProvider = function (inputRef, message) {
    // eslint-disable-next-line func-names, consistent-return
    return this.test("isIdpProvider", message, function (value) {
      const providerId = this.resolve(inputRef);
      const provider = providers.find(currentProvider => currentProvider.get("unique_id") === providerId);

      if (provider) {
        const regexMatch = new RegExp(`@${provider.get("user_domain")}$`);

        return value.match(regexMatch)
          ? true
          : this.createError({
              message: i18n.t("user.invalid_provider_username", {
                domain: provider.get("user_domain")
              }),
              path: this.path
            });
      }
    });
  };

  addMethod(string, "isIdpProvider", isIdpProvider);

  const excludedFieldsOnAccountPage = {
    agency_id: number().nullable().required().label(i18n.t("user.agency")),
    role_unique_id: string().nullable().required().label(i18n.t("user.role_id")),
    user_group_unique_ids: array().required().label(i18n.t("user.user_group_unique_ids"))
  };

  const passwordFieldValidations = {
    password: string().when("password_setting", {
      is: setting => formMode.get("isNew") && setting === PASSWORD_SELF_OPTION,
      then: string()
        .min(PASSWORD_MIN_LENGTH, i18n.t("errors.models.user.password_length", { min: PASSWORD_MIN_LENGTH }))
        .nullable()
        .required(i18n.t("forms.required_field", { field: i18n.t("user.password") })),
      otherwise: string().nullable()
    }),
    password_confirmation: string().when("password_setting", {
      is: setting => formMode.get("isNew") && setting === PASSWORD_SELF_OPTION,
      then: string()
        .min(PASSWORD_MIN_LENGTH, i18n.t("errors.models.user.password_length", { min: PASSWORD_MIN_LENGTH }))
        .nullable()
        .oneOf([ref("password"), null], i18n.t("errors.models.user.password_mismatch"))
        .required(i18n.t("forms.required_field", { field: i18n.t("user.password_confirmation") })),
      otherwise: string().nullable()
    })
  };

  const defaultFieldsValidation = {
    email: string().email(i18n.t("errors.models.user.email")).required().label(i18n.t("user.email")),
    full_name: string().required().label(i18n.t("user.full_name")),
    identity_provider_unique_id:
      useProviders &&
      string()
        .nullable()
        .required(i18n.t("forms.required_field", { field: i18n.t("user.identity_provider") })),
    location: string().nullable().required().label(i18n.t("user.location")),
    password_setting:
      isMyAccountPage || !formMode.get("isNew") || useProviders
        ? string().nullable()
        : string()
            .nullable()
            .required(i18n.t("forms.required_field", { field: i18n.t("user.password_setting.label") })),
    user_name: useProviders
      ? string()
          .email(i18n.t("errors.models.user.email"))
          .required()
          .label(i18n.t("user.user_name"))
          .isIdpProvider(ref("identity_provider_unique_id"))
      : string().required().label(i18n.t("user.user_name"))
  };

  if (isMyAccountPage) {
    return object().shape(defaultFieldsValidation);
  }

  return object().shape({ ...defaultFieldsValidation, ...passwordFieldValidations, ...excludedFieldsOnAccountPage });
};
