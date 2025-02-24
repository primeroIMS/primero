// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { QUEUE_HALTED, QUEUE_READY } from "../../libs/queue/constants";
import Queue from "../../libs/queue";
import { getIsAuthenticated } from "../user/selectors";
import { clearDialog } from "../action-dialog/action-creators";
import { selectDialog } from "../action-dialog/selectors";
import useRefreshUserToken from "../user/use-refresh-token";
import { LOGIN_DIALOG } from "../login-dialog/constants";
import useMemoizedSelector from "../../libs/use-memoized-selector";
import DB, { DB_STORES } from "../../db";

import {
  selectBrowserStatus,
  selectNetworkStatus,
  selectServerStatusRetries,
  selectQueueStatus,
  selectUserToggleOffline,
  selectPendingUserLogin
} from "./selectors";
import { checkServerStatus, setQueueData, setQueueStatus } from "./action-creators";
import { CHECK_SERVER_INTERVAL, CHECK_SERVER_RETRY_INTERVAL } from "./constants";

const useConnectivityStatus = () => {
  const dispatch = useDispatch();
  const { refreshUserToken } = useRefreshUserToken();

  const online = useMemoizedSelector(state => selectNetworkStatus(state));
  const fieldMode = useMemoizedSelector(state => selectUserToggleOffline(state));
  const authenticated = useMemoizedSelector(state => getIsAuthenticated(state));
  const queueStatus = useMemoizedSelector(state => selectQueueStatus(state));
  const currentDialog = useMemoizedSelector(state => selectDialog(state));
  const serverStatusRetries = useMemoizedSelector(state => selectServerStatusRetries(state));
  const browserStatus = useMemoizedSelector(state => selectBrowserStatus(state));
  const pendingUserLogin = useMemoizedSelector(state => selectPendingUserLogin(state));

  const fetchQueue = async () => {
    const queueData = await DB.getAll(DB_STORES.OFFLINE_REQUESTS);

    dispatch(setQueueData(queueData));
  };

  const handleNetworkChange = (isOnline, delay = CHECK_SERVER_INTERVAL) => {
    const dispatchServerStatus = () => dispatch(checkServerStatus(isOnline, fieldMode));

    if (isOnline) {
      const timer = setTimeout(() => {
        dispatchServerStatus();
      }, delay);

      clearTimeout(timer);
    } else {
      dispatchServerStatus();
    }
  };

  const handleOnline = () => {
    const timer = setTimeout(() => {
      dispatch(checkServerStatus(true));
      clearTimeout(timer);
    }, CHECK_SERVER_INTERVAL);
  };

  const handleOffline = () => {
    dispatch(checkServerStatus(false));
  };

  const removeConnectionListeners = () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };

  const setConnectionListeners = () => {
    if (typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }
  };

  useEffect(() => {
    if (!online && browserStatus && serverStatusRetries >= 1 && serverStatusRetries < 3) {
      handleNetworkChange(true);
    }

    if (!online && browserStatus && serverStatusRetries >= 3) {
      handleNetworkChange(true, CHECK_SERVER_RETRY_INTERVAL);
    }
  }, [browserStatus, online, serverStatusRetries, fieldMode]);

  useEffect(() => {
    if (!online) {
      dispatch(setQueueStatus(QUEUE_HALTED));

      if (currentDialog?.get("dialog", "") === LOGIN_DIALOG) {
        dispatch(clearDialog());
      }
    }
  }, [online]);

  useEffect(() => {
    if (online && queueStatus === QUEUE_HALTED) {
      refreshUserToken(true);
    }
  }, [online, queueStatus]);

  useEffect(() => {
    const ready = online && authenticated && queueStatus === QUEUE_READY && !pendingUserLogin;

    const startQueue = async () => {
      Queue.ready = ready;
      Queue.dispatch = dispatch;

      if (ready) {
        await fetchQueue();
      }

      if (ready && Queue.hasWork()) {
        Queue.start();
      }
    };

    startQueue();
  }, [online, authenticated, queueStatus, pendingUserLogin]);

  useEffect(() => {
    setConnectionListeners();

    return () => {
      removeConnectionListeners();
    };
  }, []);

  return { online, fieldMode };
};

export default useConnectivityStatus;
