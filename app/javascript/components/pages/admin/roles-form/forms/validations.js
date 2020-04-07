import * as yup from "yup";

export default i18n =>
  yup.object().shape({
    name: yup.string().required(),
    permissions: yup
      .object()
      .test(
        "permissions",
        i18n.t("errors.models.role.permission_presence"),
        async value => {
          const selectedPermissions = { ...value };

          delete selectedPermissions.objects;

          return Object.values(selectedPermissions).flat().length > 0;
        }
      )
  });
