import { useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

import usePushNotifications from "../push-notifications-toggle/use-push-notifications";
import { ROUTES } from "../../config";
import { setPendingUserLogin } from "../connectivity/action-creators";

import { NAME } from "./constants";

function Container() {
  const { stopRefreshNotificationTimer } = usePushNotifications();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(setPendingUserLogin(false));
    stopRefreshNotificationTimer();
    dispatch(push(ROUTES.login));
  }, []);

  return false;
}

Container.displayName = NAME;

export default Container;
