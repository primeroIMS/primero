import { isEmpty } from "lodash";

import { ADMIN_RESOURCES } from "../../../libs/permissions";

import { DEFAULT_DISABLED_FILTER } from "./constants";

export const headersToColumns = (headers, i18n) =>
  headers.map(({ name, field_name: fieldName }) => ({
    label: i18n.t(name),
    name: fieldName
  }));

export const getAdminResources = userPermissions =>
  ADMIN_RESOURCES.filter(
    adminResource => userPermissions.keySeq().includes(adminResource) && userPermissions.get(adminResource).size > 0
  );

export const onSubmitFilters = data => (dispatch, fetchMethod) => {
  const setDefaultFilters = isEmpty(data) ? DEFAULT_DISABLED_FILTER : {};

  dispatch(fetchMethod({ data: { ...data, ...setDefaultFilters } }));
};
