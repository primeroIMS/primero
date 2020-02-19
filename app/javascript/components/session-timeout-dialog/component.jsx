import React, { useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@material-ui/core";
import IdleTimer from "react-idle-timer";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";

import { refreshToken } from "../user";
import { useI18n } from "../i18n";
import {
  IDLE_TIMEOUT,
  IDLE_LOGOUT_TIMEOUT,
  TOKEN_REFRESH_INTERVAL
} from "../../config";
import { setUserIdle, selectUserIdle } from "../application";

const SessionTimeoutDialog = () => {
  const idleRef = useRef(null);
  const logoutTimer = useRef();
  const tokenRefreshTimer = useRef();
  const dispatch = useDispatch();
  const userIdle = useSelector(state => selectUserIdle(state));
  const i18n = useI18n();

  const idleUser = useCallback(action => {
    dispatch(setUserIdle(action));
    localStorage.setItem("userIdle", action);
  });

  const logout = () => {
    dispatch(push("/logout"));
  };

  const startLogoutTimer = () => {
    logoutTimer.current = setTimeout(() => {
      logout();
    }, IDLE_LOGOUT_TIMEOUT);
  };

  const refreshUserToken = () => {
    dispatch(refreshToken());
  };

  const startTokenRefreshTimer = useCallback(() => {
    tokenRefreshTimer.current = setInterval(() => {
      refreshUserToken();
    }, TOKEN_REFRESH_INTERVAL);
  });

  const stopAllTimers = () => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    if (tokenRefreshTimer.current) clearInterval(tokenRefreshTimer.current);
  };

  const onIdle = () => {
    idleRef.current.pause();
    idleUser(true);
    startLogoutTimer();
  };

  const onContinue = () => {
    stopAllTimers();
    idleRef.current.reset();
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

  useEffect(() => {
    idleUser(false);
    startTokenRefreshTimer();
    window.addEventListener("storage", localStorageChange);

    return () => {
      stopAllTimers();
      window.removeEventListener("storage", localStorageChange);
    };
  }, []);

  const handleContinue = e => {
    e.preventDefault();
    onContinue();
  };

  const handleLogout = e => {
    e.preventDefault();
    logout();
  };

  return (
    <>
      <IdleTimer
        ref={idleRef}
        element={document}
        timeout={IDLE_TIMEOUT}
        onIdle={onIdle}
      />
      <Dialog open={userIdle}>
        <DialogTitle>{i18n.t("messages.logout_confirmation")}</DialogTitle>
        <DialogContent>{i18n.t("messages.logout_warning")}</DialogContent>
        <DialogActions>
          <Button onClick={handleLogout}>{i18n.t("buttons.logout")}</Button>
          <Button onClick={handleContinue}>{i18n.t("buttons.continue")}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SessionTimeoutDialog;
