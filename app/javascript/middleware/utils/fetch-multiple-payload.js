import { FETCH_TIMEOUT } from "../../config";

import fetchParamsBuilder from "./fetch-params-builder";
import fetchSinglePayload from "./fetch-single-payload";
import fetchStatus from "./fetch-status";
import processSubforms from "./process-subforms";
import startSignout from "./start-signout";

const fetchMultiPayload = (action, store, options) => {
  const controller = new AbortController();

  setTimeout(() => {
    controller.abort();
  }, FETCH_TIMEOUT);

  const { type, finishedCallback, finishedCallbackSubforms } = action;

  const fetchParams = action.api.map(apiParams => fetchParamsBuilder(apiParams, options, controller));

  const fetch = async () => {
    fetchStatus({ store, type }, "STARTED", true);

    const responses = await Promise.allSettled(
      fetchParams.map(fetchParam =>
        window
          .fetch(fetchParam.fetchPath, fetchParam.fetchOptions)
          .then(response =>
            response
              .json()
              .then(json => {
                let newJson = json;

                if (!response.ok) {
                  newJson = {
                    ...newJson,
                    errors: newJson.errors.map(error =>
                      error.detail
                        ? { ...error, value: JSON.parse(fetchParam.fetchOptions.body).data[error.detail] }
                        : error
                    )
                  };
                }

                return {
                  path: fetchParam.fetchPath,
                  status: response.status,
                  ok: response.ok,
                  json: newJson
                };
              })
              .catch(error => ({
                path: fetchParam.fetchPath,
                status: response.status,
                ok: response.ok,
                error
              }))
          )
          .catch(error => ({
            path: fetchParam.fetchPath,
            ok: false,
            error: error?.message
          }))
      )
    );

    const results = responses.map(result => result.value);

    if (results.find(result => result && result.status === 401)) {
      fetchStatus({ store, type }, "FAILURE", results);

      startSignout(store);
    } else {
      store.dispatch({
        type: `${type}_SUCCESS`,
        payload: responses.map(result => result.value)
      });

      fetchStatus({ store, type }, "FINISHED", false);

      if (finishedCallback) {
        [finishedCallback].flat().forEach(callback => {
          if (callback.api) {
            fetchSinglePayload(callback, store, options);
          } else {
            store.dispatch(callback);
          }
        });
      }

      if (finishedCallbackSubforms) {
        const subformsCallback = processSubforms(finishedCallbackSubforms, responses);

        fetchSinglePayload(subformsCallback, store, options);
      }
    }
  };

  return fetch();
};

export default fetchMultiPayload;
