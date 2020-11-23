import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Queue, { QUEUE_HALTED, QUEUE_READY } from "../../libs/queue";
import { getIsAuthenticated } from "../user/selectors";
import { clearDialog } from "../action-dialog";
import { refreshToken } from "../user";

import { selectNetworkStatus, selectQueueStatus } from "./selectors";
import { checkServerStatus, setQueueStatus } from "./action-creators";

const useConnectivityStatus = () => {
  const dispatch = useDispatch();
  const online = useSelector(state => selectNetworkStatus(state));
  const authenticated = useSelector(state => getIsAuthenticated(state));
  const queueStatus = useSelector(state => selectQueueStatus(state));

  const handleNetworkChange = isOnline => {
    dispatch(checkServerStatus(isOnline));

    if (!isOnline) {
      dispatch(setQueueStatus(QUEUE_HALTED));
      dispatch(clearDialog());
    }
  };

  useEffect(() => {
    if (online && queueStatus === QUEUE_HALTED) {
      dispatch(refreshToken(true));
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
      window.addEventListener("online", () => handleNetworkChange(true));
      window.addEventListener("offline", () => handleNetworkChange(false));
    }

    return () => {
      window.removeEventListener("online", () => handleNetworkChange(true));
      window.removeEventListener("offline", () => handleNetworkChange(false));
    };
  }, []);

  return { online };
};

export default useConnectivityStatus;
