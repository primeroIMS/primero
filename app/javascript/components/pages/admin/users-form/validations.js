import { object, number, string, lazy, ref, array, addMethod } from "yup";

export default (formMode, i18n, useIdentityProviders, providers) => {
  const useProviders = useIdentityProviders && providers;

  // eslint-disable-next-line func-names
  const isIdpProvider = function (inputRef, message) {
    // eslint-disable-next-line func-names, consistent-return
    return this.test("isIdpProvider", message, function (value) {
      const providerId = this.resolve(inputRef);
      const provider = providers.find(
        currentProvider =>
          currentProvider.get("id") === parseInt(providerId, 10)
      );

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

  return object().shape({
    agency_id: number().required().label(i18n.t("user.organization")),
    email: string().required().label(i18n.t("user.email")),
    full_name: string().required().label(i18n.t("user.full_name")),
    identity_provider_id: useProviders && number().required(),
    location: string().required().label(i18n.t("user.location")),
    password:
      !useProviders &&
      lazy(value => {
        const defaultValidation = value ? string().min(8) : string();

        if (formMode.get("isNew")) {
          return defaultValidation.required().label(i18n.t("user.password"));
        }

        return defaultValidation;
      }),
    password_confirmation:
      !useProviders &&
      lazy(() => {
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
      }),
    role_unique_id: string().required().label(i18n.t("user.role_id")),
    user_group_unique_ids: array()
      .required()
      .label(i18n.t("user.user_group_unique_ids")),
    user_name: useProviders
      ? string()
          .required()
          .label(i18n.t("user.user_name"))
          .isIdpProvider(ref("identity_provider_id"))
      : string().required().label(i18n.t("user.user_name"))
  });
};
