import { useEffect, useRef, useCallback } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@material-ui/core";
import { useIdleTimer } from "react-idle-timer";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

import { useRefreshUserToken } from "../user";
import { useI18n } from "../i18n";
import { IDLE_TIMEOUT, IDLE_LOGOUT_TIMEOUT, TOKEN_REFRESH_INTERVAL } from "../../config";
import { setUserIdle, selectUserIdle, useApp } from "../application";
import { useMemoizedSelector } from "../../libs";

import { NAME } from "./constants";

const SessionTimeoutDialog = () => {
  const { online } = useApp();
  const logoutTimer = useRef();
  const tokenRefreshTimer = useRef();
  const dispatch = useDispatch();
  const userIdle = useMemoizedSelector(state => selectUserIdle(state));
  const i18n = useI18n();
  const { refreshUserToken } = useRefreshUserToken();

  const logout = () => {
    dispatch(push("/logout"));
  };

  const idleUser = useCallback(action => {
    dispatch(setUserIdle(action));
    localStorage.setItem("userIdle", action);
  });

  const startLogoutTimer = () => {
    logoutTimer.current = setTimeout(() => {
      logout();
    }, IDLE_LOGOUT_TIMEOUT);
  };

  const onIdle = () => {
    idleUser(true);
    startLogoutTimer();
  };

  const { reset, pause } = useIdleTimer({
    timeout: IDLE_TIMEOUT,
    onIdle
  });

  const startTokenRefreshTimer = useCallback(() => {
    tokenRefreshTimer.current = setInterval(() => {
      refreshUserToken();
    }, TOKEN_REFRESH_INTERVAL);
  });

  const stopAllTimers = () => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    if (tokenRefreshTimer.current) clearInterval(tokenRefreshTimer.current);
  };

  const onContinue = () => {
    stopAllTimers();
    reset();
    idleUser(false);

    refreshUserToken();
    startTokenRefreshTimer();
  };

  const localStorageChange = e => {
    const { key, newValue, oldValue } = e;

    if (key === "userIdle") {
      if (newValue === "true" && oldValue === "false") {
        onIdle();
      } else if (newValue === "false" && oldValue === "true") {
        onContinue();
      } else if (newValue === "logout") {
        logout();
      }
    }
  };

  const stopTimeoutDialog = () => {
    stopAllTimers();
    window.removeEventListener("storage", localStorageChange);
  };

  useEffect(() => {
    if (online) {
      idleUser(false);
      reset();
      startTokenRefreshTimer();
      window.addEventListener("storage", localStorageChange);
    } else {
      pause();
      stopTimeoutDialog();
    }
  }, [online]);

  useEffect(() => stopTimeoutDialog, []);

  useEffect(() => {
    if (userIdle) {
      pause();
    }
  }, [userIdle]);

  const handleContinue = e => {
    e.preventDefault();
    onContinue();
  };

  const handleLogout = e => {
    e.preventDefault();
    logout();
  };

  return online ? (
    <>
      <Dialog open={userIdle}>
        <DialogTitle>{i18n.t("messages.logout_confirmation")}</DialogTitle>
        <DialogContent>{i18n.t("messages.logout_warning")}</DialogContent>
        <DialogActions>
          <Button onClick={handleLogout}>{i18n.t("buttons.logout")}</Button>
          <Button onClick={handleContinue}>{i18n.t("buttons.continue")}</Button>
        </DialogActions>
      </Dialog>
    </>
  ) : null;
};

SessionTimeoutDialog.displayName = NAME;

export default SessionTimeoutDialog;
