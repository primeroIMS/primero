import qs from "qs";
import { attemptSignout, FETCH_USER_DATA } from "components/user";
import { FETCH_TIMEOUT } from "config";
import { push } from "connected-react-router";
import { FETCH_SYSTEM_SETTINGS } from "components/application";
import { RECORD_FORMS } from "components/record-form";
import { RECORDS } from "components/record-list";
import DB from "../db";
import * as schemas from "../schemas";

export const queryParams = {
  toString: obj => qs.stringify(obj),
  parse: str => qs.parse(str)
};

const savePayloadToDB = async (type, json, normalizeFunc, path) => {
  switch (type) {
    case FETCH_USER_DATA:
      return DB.put("user", json.data);
    case FETCH_SYSTEM_SETTINGS:
      return DB.put("system_settings", json.data, { id: 1 });
    case `${path}/${RECORDS}`: {
      const { data, metadata } = json;
      return {
        data: await DB.bulkAdd("records", data, { index: "type", value: path }),
        metadata
      };
    }
    case RECORD_FORMS: {
      const data = schemas[normalizeFunc](json.data).entities;
      return {
        formSections: await DB.bulkAdd("forms", data.formSections),
        fields: await DB.bulkAdd("fields", data.fields)
      };
    }
    default:
      return null;
  }
};

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.token : null;
};

const restMiddleware = options => store => next => action => {
  if (!(action.api && "path" in action.api)) {
    return next(action);
  }

  // TODO: We will store this elsewhere in the future. This is not secure
  const token = getToken();

  const headers = {
    "content-type": "application/json"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();

  setTimeout(() => {
    controller.abort();
  }, FETCH_TIMEOUT);

  const defaultFetchOptions = {
    method: "GET",
    mode: "same-origin",
    credentials: "same-origin",
    cache: "no-cache",
    redirect: "follow",
    headers: new Headers(headers),
    signal: controller.signal
  };

  const { type, api } = action;
  const { path, body, params, method, normalizeFunc, successCallback } = api;
  const fetchOptions = Object.assign({}, defaultFetchOptions, { method });

  let fetchPath = `${options.baseUrl}/${path}`;

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  if (params) {
    fetchPath += `?${queryParams.toString(params)}`;
  }

  const fetch = async () => {
    store.dispatch({
      type: `${type}_STARTED`,
      payload: true
    });

    try {
      const response = await window.fetch(fetchPath, fetchOptions);
      const json = await response.json();

      if (!response.ok) {
        store.dispatch({
          type: `${type}_FAILURE`,
          payload: json
        });

        if (response.status === 401) {
          store.dispatch(attemptSignout());
        }
      } else {
        const payloadFromDB = await savePayloadToDB(
          type,
          json,
          normalizeFunc,
          path
        );

        store.dispatch({
          type: `${type}_SUCCESS`,
          payload: payloadFromDB || json
        });

        if (successCallback) {
          const isCallbackObject = typeof successCallback === "object";
          const successPayload = isCallbackObject
            ? {
                type: successCallback.action,
                payload: successCallback.payload
              }
            : {
                type: successCallback,
                payload: { response, json }
              };

          store.dispatch(successPayload);

          if (isCallbackObject && successCallback.redirect) {
            store.dispatch(push(successCallback.redirect));
          }
        }
      }

      store.dispatch({
        type: `${type}_FINISHED`,
        payload: false
      });
    } catch (e) {
      console.warn(e);
      store.dispatch({
        type: `${type}_FAILURE`,
        payload: true
      });
    }
  };

  return fetch();
};

export default restMiddleware;
