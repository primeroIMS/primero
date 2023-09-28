import { useCallback, useEffect, useRef } from "react";
import { workerTimers } from "react-idle-timer";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import { POST_MESSAGES, PUSH_NOTIFICATION_SUBSCRIPTION_REFRESH_INTERVAL, ROUTES } from "../../config/constants";
import useMemoizedSelector from "../../libs/use-memoized-selector";
import { getNotificationSubscription, getUserProperty } from "../user/selectors";
import { toServerDateFormat } from "../../libs";

import { refreshNotificationSubscription } from "./action-creators";

let refreshTimer;

function usePushNotifications() {
  const dispatch = useDispatch();
  const location = useLocation();
  const endpoint = useRef();
  const notificationEndpoint = useMemoizedSelector(state => getNotificationSubscription(state));
  const receiveWebpush = useMemoizedSelector(state => getUserProperty(state, "receiveWebpush"));
  const userLoaded = useMemoizedSelector(state => getUserProperty(state, "loaded"));
  const isAuthenticated = useMemoizedSelector(state => getUserProperty(state, "isAuthenticated"));

  const locationNotLogout = location.pathname !== ROUTES.logout;
  const shouldPingSubscription = notificationEndpoint && userLoaded && receiveWebpush && locationNotLogout;

  useEffect(() => {
    endpoint.current = notificationEndpoint;
  }, [notificationEndpoint]);

  const pingSubscription = () => {
    dispatch(
      refreshNotificationSubscription({
        data: {
          updated_at: toServerDateFormat(Date.now(), { includeTime: true }),
          notification_url: endpoint.current
        }
      })
    );
  };

  const startRefreshNotificationTimer = useCallback(() => {
    if (shouldPingSubscription) {
      refreshTimer = workerTimers.setInterval(() => {
        pingSubscription();
      }, PUSH_NOTIFICATION_SUBSCRIPTION_REFRESH_INTERVAL);
    }
  }, [notificationEndpoint, userLoaded, receiveWebpush, locationNotLogout]);

  const stopRefreshNotificationTimer = useCallback(() => {
    if (refreshTimer) {
      workerTimers.clearInterval(refreshTimer);
      refreshTimer = undefined;
    }
  });

  useEffect(() => {
    if (shouldPingSubscription) {
      pingSubscription();
    }
  }, [userLoaded]);

  useEffect(() => {
    startRefreshNotificationTimer();
  }, [notificationEndpoint, userLoaded, receiveWebpush]);

  useEffect(() => {
    if (!receiveWebpush && userLoaded) {
      stopRefreshNotificationTimer();
      postMessage(
        {
          type: POST_MESSAGES.UNSUBSCRIBE_NOTIFICATIONS
        },
        window.origin
      );
    }
  }, [receiveWebpush]);

  useEffect(() => {
    return () => {
      stopRefreshNotificationTimer();
    };
  }, [notificationEndpoint]);

  return {
    startRefreshNotificationTimer,
    stopRefreshNotificationTimer
  };
}

export default usePushNotifications;
