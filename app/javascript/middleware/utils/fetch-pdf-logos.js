// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { getAgencyLogosPdf } from "../../components/application/selectors";
import { METHODS, syncIndexedDB } from "../../db";
import Logos from "../../db/collections/logos";
import { reduceMapToObject } from "../../libs";

import fetchPayload from "./fetch-payload";
import fetchStatus from "./fetch-status";

const getAgencyLogoOptions = async (action, store) => {
  const {
    api: { db }
  } = action;
  const result = await syncIndexedDB(db, action, METHODS.READ);

  if (result?.data) {
    return result.data.agencies_logo_options;
  }

  return reduceMapToObject(getAgencyLogosPdf(store.getState()));
};

const fetchPdfLogos = (action, store, options, next) => {
  const { type } = action;
  const fetch = async () => {
    try {
      const agenciesLogoOptions = await getAgencyLogoOptions(action, store);
      const agenciesLogoPdf = await Logos.save(agenciesLogoOptions);

      store.dispatch({
        type: `${type}_SUCCESS`,
        payload: { data: agenciesLogoPdf }
      });

      fetchStatus({ store, type }, "FINISHED", false);

      return next(action);
    } catch {
      fetchStatus({ store, type }, "FAILURE", false);
    }

    return fetchPayload(action, store, options);
  };

  return fetch();
};

export default fetchPdfLogos;
