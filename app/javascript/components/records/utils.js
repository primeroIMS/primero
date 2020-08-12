/* eslint-disable import/prefer-default-export */

import { Map } from "immutable";
import pickBy from "lodash/pickBy";

import { DEFAULT_METADATA } from "../../config";

import { clearMetadata } from "./action-creators";

const getRouteValue = (index, data) => data.split("/").filter(value => value)[index];

export const cleanUpFilters = filters => {
  const filterSelector = filters instanceof Map ? filters.toJS() : filters;

  const filtersArray = pickBy(filterSelector, value => {
    const isMap = Map.isMap(value);

    return !(
      value === "" ||
      value === null ||
      (Array.isArray(value) && value.length === 0) ||
      ((isMap || typeof value === "object") && Object.values(isMap ? value.toJS() : value).includes(null))
    );
  });

  const result = Object.entries(filtersArray).reduce((acum, filter) => {
    const [key, value] = filter;
    const filterObject = acum;

    if (Array.isArray(value)) {
      filterObject[key] = value.join(",");
    } else if (typeof value === "object" && !Object.values(value).includes(null)) {
      const valueConverted = {};

      Object.entries(value).forEach(keys => {
        const [k, v] = keys;

        if (["from", "to"].includes(k)) {
          valueConverted[k] = v;
        }
      });

      if (typeof value.value !== "undefined") {
        filterObject[value.value] = valueConverted;
      }
    } else {
      filterObject[key] = value;
    }

    return filterObject;
  }, {});

  return result;
};

export const fetchDataIfNotBackButton = (
  metadata,
  location,
  history,
  onFetch,
  searchingKey,
  { dispatch, defaultFilterFields, restActionParams }
) => {
  const { per: currentPer, page: currentPage, total: currentTotal } = metadata;
  const sameLocation = location.pathname === history.location.pathname;
  const differentPageOrPer = currentPer !== DEFAULT_METADATA.per || currentPage !== DEFAULT_METADATA.page;

  if (history.action === "PUSH" && sameLocation && differentPageOrPer) {
    dispatch(
      onFetch({
        ...restActionParams,
        [searchingKey]: { ...defaultFilterFields, ...DEFAULT_METADATA }
      })
    );
  } else if (sameLocation && (differentPageOrPer || currentTotal !== "undefined")) {
    const defaultFilters = { ...defaultFilterFields, ...metadata };

    dispatch(onFetch({ ...restActionParams, [searchingKey]: defaultFilters }));
  }
};

export const clearMetadataOnLocationChange = (location, history, recordType, routeIndexValue, { dispatch }) => {
  const previous = location.pathname;
  const current = history.location.pathname;

  if (getRouteValue(routeIndexValue, previous) !== getRouteValue(routeIndexValue, current)) {
    dispatch(clearMetadata(Array.isArray(recordType) ? recordType.join("/") : recordType));
  }
};
