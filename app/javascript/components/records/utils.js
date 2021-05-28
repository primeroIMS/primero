import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Map } from "immutable";
import pickBy from "lodash/pickBy";
import isEmpty from "lodash/isEmpty";

import { DEFAULT_METADATA } from "../../config";

import { clearMetadata } from "./action-creators";

const getRouteValue = (index, data) => data.split("/").filter(value => value)[index];

const fetchDataIfNotBackButton = (
  metadata,
  location,
  history,
  onFetch,
  searchingKey,
  { dispatch, defaultFilterFields, restActionParams, defaultMetadata }
) => {
  const { per: currentPer, page: currentPage, total: currentTotal } = metadata || {};
  const sameLocation = location.pathname === history.location.pathname;
  const meta = isEmpty(defaultMetadata) ? DEFAULT_METADATA : defaultMetadata;
  const differentPageOrPer = currentPer !== meta.per || currentPage !== meta.page;

  if (history.action === "PUSH" && sameLocation && differentPageOrPer) {
    dispatch(
      onFetch({
        ...restActionParams,
        [searchingKey]: { ...defaultFilterFields, ...meta }
      })
    );
  } else if (sameLocation && (differentPageOrPer || currentTotal !== "undefined")) {
    const defaultFilters = { ...defaultFilterFields, ...metadata };

    dispatch(onFetch({ ...restActionParams, [searchingKey]: defaultFilters }));
  }
};

const clearMetadataOnLocationChange = (location, history, recordType, { dispatch }) => {
  const previous = location.pathname;
  const current = history.location.pathname;
  const routeIndexValue = previous.split("/").length <= 2 ? 0 : 1;

  if (getRouteValue(routeIndexValue, previous) !== getRouteValue(routeIndexValue, current)) {
    dispatch(clearMetadata(Array.isArray(recordType) ? recordType.join("/") : recordType));
  }
};

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

export const useMetadata = (
  recordType,
  metadata,
  fetch,
  fetchParam,
  { defaultFilterFields, restActionParams, defaultMetadata } = {}
) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    fetchDataIfNotBackButton(metadata?.toJS(), location, history, fetch, fetchParam, {
      dispatch,
      defaultFilterFields: defaultFilterFields || {},
      restActionParams: restActionParams || {},
      defaultMetadata: defaultMetadata || {}
    });
  }, []);

  useEffect(() => {
    return () => {
      clearMetadataOnLocationChange(location, history, recordType, {
        dispatch
      });
    };
  }, []);
};

export const getShortIdFromUniqueId = uniqueId => uniqueId?.slice(-7);
