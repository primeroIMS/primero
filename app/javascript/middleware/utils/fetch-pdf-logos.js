import { getAgencyLogosPdf } from "../../components/application/selectors";
import Logos from "../../db/collections/logos";
import { reduceMapToObject } from "../../libs";

import fetchPayload from "./fetch-payload";
import fetchStatus from "./fetch-status";

const fetchPdfLogos = (action, store, options, next) => {
  const {
    type,
    api: { db }
  } = action;

  const fetch = async () => {
    try {
      const agenciesLogoOptions = reduceMapToObject(getAgencyLogosPdf(store.getState()));
      console.log(agenciesLogoOptions);
      // TODO: Login success handler is deleting all data including data already downloaded for the primero database
      // that is why we can't pull the data from indexedDB should the primero collection be persisted between users?
      // const result = await syncIndexedDB(db, action, METHODS.READ);

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
