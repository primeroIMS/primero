import { useEffect } from "react";
import { useDispatch } from "react-redux";
import debounce from "lodash/debounce";

import Queue, { QUEUE_HALTED, QUEUE_READY } from "../../libs/queue";
import { getIsAuthenticated } from "../user/selectors";
import { clearDialog, selectDialog } from "../action-dialog";
import { useRefreshUserToken } from "../user";
import { LOGIN_DIALOG } from "../login-dialog";
import { useMemoizedSelector } from "../../libs";

import { selectBrowserStatus, selectNetworkStatus, selectServerStatusRetries, selectQueueStatus } from "./selectors";
import { checkServerStatus, setQueueStatus } from "./action-creators";
import { CHECK_SERVER_INTERVAL, CHECK_SERVER_RETRY_INTERVAL } from "./constants";

const useConnectivityStatus = () => {
  const dispatch = useDispatch();
  const { refreshUserToken } = useRefreshUserToken();

  const online = useMemoizedSelector(state => selectNetworkStatus(state));
  const authenticated = useMemoizedSelector(state => getIsAuthenticated(state));
  const queueStatus = useMemoizedSelector(state => selectQueueStatus(state));
  const currentDialog = useMemoizedSelector(state => selectDialog(state));
  const serverStatusRetries = useMemoizedSelector(state => selectServerStatusRetries(state));
  const browserStatus = useMemoizedSelector(state => selectBrowserStatus(state));

  const handleNetworkChange = (isOnline, delay = CHECK_SERVER_INTERVAL) => {
    const dispatchServerStatus = () => dispatch(checkServerStatus(isOnline));

    if (isOnline) {
      return debounce(dispatchServerStatus, delay);
    }

    return dispatchServerStatus;
  };

  useEffect(() => {
    if (!online && browserStatus && serverStatusRetries >= 1 && serverStatusRetries < 3) {
      handleNetworkChange(true)();
    }

    if (!online && browserStatus && serverStatusRetries >= 3) {
      handleNetworkChange(true, CHECK_SERVER_RETRY_INTERVAL)();
    }
  }, [browserStatus, online, serverStatusRetries]);

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
    const ready = online && authenticated && queueStatus === QUEUE_READY;

    Queue.ready = ready;
    Queue.dispatch = dispatch;

    if (ready && Queue.hasWork()) {
      Queue.start();
    }
  }, [online, authenticated, queueStatus]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("online", handleNetworkChange(true));
      window.addEventListener("offline", handleNetworkChange(false));
    }

    return () => {
      window.removeEventListener("online", handleNetworkChange(true));
      window.removeEventListener("offline", handleNetworkChange(false));
    };
  }, []);

  return { online };
};

export default useConnectivityStatus;
