// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { isImmutable } from "immutable";

import { FETCH_TIMEOUT, ROUTES } from "../../config";
import { DEFAULT_FETCH_OPTIONS } from "../constants";
import { disableNavigation } from "../../components/application/action-creators";
import { applyingConfigMessage } from "../../components/pages/admin/configurations-form/action-creators";
import userActions from "../../components/user/actions";
import { SET_ATTACHMENT_STATUS } from "../../components/records/actions";
import { getIDPToken } from "../../components/login/components/idp-selection/auth-provider";

import fetchStatus from "./fetch-status";
import handleConfiguration from "./handle-configuration";
import partitionObject from "./partition-object";
import buildAttachmentData from "./build-attachment-data";
import buildPath from "./build-path";
import defaultErrorCallback from "./default-error-callback";
import handleRestCallback from "./handle-rest-callback";
import startSignout from "./start-signout";
import processAttachments from "./process-attachments";
import { deleteFromQueue, messageQueueFailed, messageQueueSkip, messageQueueSuccess } from "./queue";
import handleSuccess from "./handle-success";
import FetchError from "./fetch-error";
import getCSRFToken from "./get-csrf-token";

let abortFollowingRequest = false;

const fetchSinglePayload = async (action, store, options) => {
  const controller = new AbortController();

  if (action.type === "user/LOGOUT") {
    abortFollowingRequest = true;
  }

  if (["user/LOGIN", "connectivity/SERVER_STATUS"].includes(action.type)) {
    abortFollowingRequest = false;
  }

  if (abortFollowingRequest && action.type !== "user/LOGOUT") {
    return false;
  }

  setTimeout(() => {
    controller.abort();
  }, FETCH_TIMEOUT);

  const {
    type,
    api: {
      id,
      recordType,
      path,
      body,
      params,
      method,
      normalizeFunc,
      successCallback,
      failureCallback,
      configurationCallback,
      db,
      external,
      queueAttachments
    },
    fromQueue,
    fromAttachment
  } = action;

  const [attachments, formData] = queueAttachments
    ? partitionObject(body?.data, (value, key) =>
        store.getState().getIn(["forms", "attachmentMeta", "fields"], []).includes(key)
      )
    : [false, false];

  const fetchOptions = {
    ...DEFAULT_FETCH_OPTIONS,
    method,
    signal: controller.signal,
    ...((formData || body) && {
      body: JSON.stringify(formData ? { data: formData } : body)
    })
  };

  const token = await getIDPToken();
  const headers = {
    "X-CSRF-Token": getCSRFToken()
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  fetchOptions.headers = new Headers(Object.assign(fetchOptions.headers, headers));

  const urlParams = isImmutable(params) ? params.toJS() : params;

  const fetchPath = buildPath(path, options, urlParams, external);

  const fetch = async () => {
    fetchStatus({ store, type }, "STARTED", true);

    try {
      const response = await window.fetch(fetchPath, fetchOptions);
      const { status } = response;
      const url = response.url.split("/");
      const checkHealthUrl = url.slice(url.length - 2, url.length).join("/");

      if (status === 503 || (status === 204 && `/${checkHealthUrl}` === ROUTES.check_health)) {
        handleConfiguration(status, store, options, response, { fetchStatus, fetchSinglePayload, type });
      }
      const json =
        status === 204 ? { data: { id: body?.data?.id }, ...buildAttachmentData(action) } : await response.json();

      if (!response.ok) {
        fetchStatus({ store, type }, "FAILURE", json);

        if (status === 401) {
          abortFollowingRequest = true;

          if (action.type === userActions.FETCH_USER_DATA) {
            throw new Error(window.I18n.t("error_message.error_401"));
          }

          if (action.type === userActions.LOGIN) {
            throw new Error(json.error);
          }

          startSignout(store);
        }

        if (status === 404) {
          deleteFromQueue(fromQueue);
          messageQueueSkip();
        } else if (failureCallback) {
          messageQueueFailed(fromQueue);
          handleRestCallback(store, failureCallback, response, json, fromQueue);
        } else if (action.type.includes("SAVE_ATTACHMENT") && status === 422) {
          throw new FetchError(response, json);
        } else {
          messageQueueFailed(fromQueue);
          throw new FetchError(response, json);
        }

        if (!action.type.includes("SAVE_ATTACHMENT") && status !== 422) {
          throw new Error(window.I18n.t("error_message.error_something_went_wrong"));
        }
      }
      await handleSuccess(store, {
        type,
        json,
        normalizeFunc,
        path,
        db,
        fromQueue,
        fromAttachment,
        params: urlParams
      });

      messageQueueSuccess(action);

      handleRestCallback(store, successCallback, response, json, fromQueue);

      if (attachments) {
        processAttachments({
          attachments,
          id: id || json?.data?.id,
          recordType
        });
      }

      fetchStatus({ store, type }, "FINISHED", false);

      if (configurationCallback && response.ok) {
        store.dispatch(disableNavigation());
        handleRestCallback(store, applyingConfigMessage(), response, {});
        fetchSinglePayload(configurationCallback, store, options);
      }
    } catch (error) {
      const errorDataObject = { json: error?.json, recordType, fromQueue, id, error };

      if (fromAttachment && error?.response?.status === 422) {
        deleteFromQueue(fromQueue);
        messageQueueSkip();
        store.dispatch({
          type: `${fromAttachment.record_type}/${SET_ATTACHMENT_STATUS}`,
          payload: { processing: false, error: false, pending: false, fieldName: fromAttachment.field_name }
        });
        errorDataObject.fromQueue = false;
      } else {
        messageQueueFailed(fromQueue);
      }

      fetchStatus({ store, type }, "FAILURE", false);

      if (failureCallback) {
        handleRestCallback(store, failureCallback, {}, {});
      } else {
        defaultErrorCallback({ ...errorDataObject, store, response: error?.response });
      }

      // eslint-disable-next-line no-console
      console.error({
        ...errorDataObject,
        failureCallback,
        fetchPath,
        responseText: error?.response?.statusText,
        responseStatus: error?.response?.status
      });

      throw new Error(error);
    }
  };

  return fetch();
};

export default fetchSinglePayload;
