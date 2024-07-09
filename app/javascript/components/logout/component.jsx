// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect, useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

import usePushNotifications from "../push-notifications-toggle/use-push-notifications";
import { ROUTES } from "../../config";
import { setPendingUserLogin } from "../connectivity/action-creators";
import { useMemoizedSelector } from "../../libs";
import { getIsAuthenticated } from "../user";

import { NAME } from "./constants";

function Container() {
  const { stopRefreshNotificationTimer } = usePushNotifications();
  const dispatch = useDispatch();
  const isAuthenticated = useMemoizedSelector(state => getIsAuthenticated(state));

  useLayoutEffect(() => {
    dispatch(setPendingUserLogin(false));
    stopRefreshNotificationTimer();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(push(ROUTES.login));
    }
  }, [isAuthenticated]);

  return false;
}

Container.displayName = NAME;

export default Container;
