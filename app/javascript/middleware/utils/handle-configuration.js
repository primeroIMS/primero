import {
  applyingConfigMessage,
  checkConfiguration,
  appliedConfigMessage
} from "../../components/pages/admin/configurations-form/action-creators";
import { disableNavigation } from "../../components/application/action-creators";

import handleRestCallback from "./handle-rest-callback";

export default async (status, store, options, response, { fetchStatus, fetchSinglePayload, type }) => {
  const delay = ms => new Promise(res => setTimeout(res, ms));

  if (status === 503) {
    store.dispatch(disableNavigation(true));
    handleRestCallback(store, applyingConfigMessage(), response, {});
    await delay(10000);

    fetchSinglePayload(checkConfiguration(), store, options);
  } else if (status === 204) {
    fetchStatus({ store, type }, "SUCCESS", true);
    fetchStatus({ store, type }, "FINISHED", false);

    handleRestCallback(store, appliedConfigMessage(), response, {});
    await delay(1000);
    window.location.reload(true);
  }
};
