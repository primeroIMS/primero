// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { object, string, array } from "yup";

export default i18n =>
  object().shape({
    module_unique_ids: array().min(1),
    name: string().required(),
    permissions: object().test("permissions", i18n.t("errors.models.role.permission_presence"), async value => {
      const selectedPermissions = { ...value };

      delete selectedPermissions.objects;

      return Object.values(selectedPermissions).flat().length > 0;
    })
  });
