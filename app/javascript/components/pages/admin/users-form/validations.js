import { object, number, string, ref, array, addMethod } from "yup";

export default (formMode, i18n, useIdentityProviders, providers, isMyAccountPage = false) => {
  const useProviders = useIdentityProviders && providers;

  // eslint-disable-next-line func-names
  const isIdpProvider = function (inputRef, message) {
    // eslint-disable-next-line func-names, consistent-return
    return this.test("isIdpProvider", message, function (value) {
      const providerId = this.resolve(inputRef);
      const provider = providers.find(currentProvider => currentProvider.get("id") === parseInt(providerId, 10));

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

  const defaultFieldsValidation = {
    email: string().required().label(i18n.t("user.email")),
    full_name: string().required().label(i18n.t("user.full_name")),
    identity_provider_id: useProviders && number().required(),
    location: string().nullable().required().label(i18n.t("user.location")),
    user_name: useProviders
      ? string().required().label(i18n.t("user.user_name")).isIdpProvider(ref("identity_provider_id"))
      : string().required().label(i18n.t("user.user_name"))
  };

  if (isMyAccountPage) {
    return object().shape(defaultFieldsValidation);
  }

  return object().shape({ ...defaultFieldsValidation, ...excludedFieldsOnAccountPage });
};
