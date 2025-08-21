// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import {
  applyingConfigMessage,
  checkConfiguration,
  appliedConfigMessage
} from "../../components/pages/admin/configurations-form/action-creators";
import { disableNavigation } from "../../components/application/action-creators";

import handleRestCallback from "./handle-rest-callback";

const delay = ms => new Promise(res => setTimeout(res, ms));

let isFirstCheck = true;
let prevStatus = null;
let configTimoutTimerRunning = false;
let timer = null;

function configurationCheckTimer() {
  timer = setTimeout(() => {
    isFirstCheck = false;
  }, 5 * 60 * 1000);
}

export default async (status, store, options, response, { fetchStatus, fetchSinglePayload, type }) => {
  if (!configTimoutTimerRunning) {
    configTimoutTimerRunning = true;
    configurationCheckTimer();
  }

  if (status === 503 || (status === 204 && isFirstCheck)) {
    store.dispatch(disableNavigation(true));
    handleRestCallback(store, applyingConfigMessage(), response, {});

    if (status === 503) {
      await delay(10000);
    }

    if (prevStatus !== status) {
      prevStatus = status;
    }

    if (status === 503) {
      isFirstCheck = false;
    }

    fetchSinglePayload(checkConfiguration(), store, options);
  } else if (status === 204) {
    fetchStatus({ store, type }, "SUCCESS", true);
    fetchStatus({ store, type }, "FINISHED", false);

    handleRestCallback(store, appliedConfigMessage(), response, {});
    await delay(1000);
    clearTimeout(timer);
    window.location.reload(true);
  }
};
