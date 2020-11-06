import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Queue from "../../libs/queue";
import { getIsAuthenticated } from "../user/selectors";

import { selectNetworkStatus } from "./selectors";
import { checkServerStatus } from "./action-creators";

const useConnectivityStatus = () => {
  const dispatch = useDispatch();
  const online = useSelector(state => selectNetworkStatus(state));
  const authenticated = useSelector(state => getIsAuthenticated(state));

  const handleNetworkChange = isOnline => {
    dispatch(checkServerStatus(isOnline));
  };

  useEffect(() => {
    if (online && authenticated) {
      Queue.ready = online && authenticated;
      Queue.dispatch = dispatch;
      if (Queue.hasWork()) {
        Queue.start();
      }
    }
  }, [online, authenticated]);

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
