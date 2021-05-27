import { batch } from "react-redux";

import { ADMIN_RESOURCES } from "../../../libs/permissions";

export const headersToColumns = (headers, i18n) =>
  headers.map(({ name, field_name: fieldName }) => ({
    label: i18n.t(name),
    name: fieldName
  }));

export const getAdminResources = userPermissions =>
  ADMIN_RESOURCES.filter(
    adminResource => userPermissions.keySeq().includes(adminResource) && userPermissions.get(adminResource).size > 0
  );

export const onSubmitFilters = (data, dispatch, fetch, setFilters) => {
  const filters = { data };

  batch(() => {
    dispatch(fetch(filters));
    dispatch(setFilters(filters));
  });
};

export const filterOnTableChange = (dispatch, fetch, setFilters) => filters => {
  dispatch(setFilters(filters));

  return fetch(filters);
};

export const validateMetadata = (payload, defaultMetadata) => {
  if (payload.get("per") === null && payload.get("page") === null) {
    return payload.merge(defaultMetadata);
  }

  return payload;
};
