import { object, string } from "yup";

export default i18n =>
  object().shape({
    name: string().required(),
    permissions: object().test(
      "permissions",
      i18n.t("errors.models.role.permission_presence"),
      async value => {
        const selectedPermissions = { ...value };

        delete selectedPermissions.objects;

        return Object.values(selectedPermissions).flat().length > 0;
      }
    )
  });
