// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect, useRef, useCallback } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useIdleTimer, workerTimers } from "react-idle-timer";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

import { useRefreshUserToken } from "../user";
import { useI18n } from "../i18n";
import { IDLE_TIMEOUT, IDLE_LOGOUT_TIMEOUT, TOKEN_REFRESH_INTERVAL } from "../../config";
import { setUserIdle, selectUserIdle, useApp } from "../application";
import useMemoizedSelector from "../../libs/use-memoized-selector";

import { NAME } from "./constants";

function SessionTimeoutDialog() {
  const { online } = useApp();
  const tokenRefreshTimer = useRef();
  const dispatch = useDispatch();
  const { refreshUserToken } = useRefreshUserToken();
  const i18n = useI18n();

  const userIdle = useMemoizedSelector(state => selectUserIdle(state));

  const logout = () => {
    dispatch(push("/logout"));
  };

  const idleUser = useCallback(action => {
    dispatch(setUserIdle(action));
  });

  const startTokenRefreshTimer = useCallback(() => {
    tokenRefreshTimer.current = workerTimers.setInterval(() => {
      refreshUserToken();
    }, TOKEN_REFRESH_INTERVAL);
  });

  const stopTokenRefreshTimer = useCallback(() => {
    if (tokenRefreshTimer.current) workerTimers.clearInterval(tokenRefreshTimer.current);
  });

  const { reset, pause, activate, message } = useIdleTimer({
    timeout: IDLE_TIMEOUT + IDLE_LOGOUT_TIMEOUT,
    leaderElection: true,
    promptBeforeIdle: IDLE_LOGOUT_TIMEOUT,
    crossTab: true,
    syncTimers: 200,
    timers: workerTimers,
    onPrompt: () => {
      idleUser(true);
    },
    onActive: () => {
      idleUser(false);
      refreshUserToken();
      startTokenRefreshTimer();
    },
    onMessage: data => {
      switch (data.action) {
        case "LOGOUT":
          logout();
          break;
        case "OFFLINE":
          pause();
          stopTokenRefreshTimer();
          break;
        case "ONLINE":
          idleUser(false);
          reset();
          startTokenRefreshTimer();
          break;
        default:
      }
    },
    onIdle: () => {
      message({ action: "LOGOUT" }, true);
    }
  });

  useEffect(() => {
    if (online) {
      message({ action: "ONLINE" }, true);
    } else {
      message({ action: "OFFLINE" }, true);
    }
  }, [online]);

  useEffect(() => {
    return () => {
      pause();
      stopTokenRefreshTimer();
    };
  }, []);

  const handleContinue = e => {
    e.preventDefault();
    activate();
  };

  const handleLogout = e => {
    e.preventDefault();
    message({ action: "LOGOUT" }, true);
  };

  return online ? (
    <>
      <Dialog open={userIdle}>
        <DialogTitle>{i18n.t("messages.logout_confirmation")}</DialogTitle>
        <DialogContent>{i18n.t("messages.logout_warning")}</DialogContent>
        <DialogActions>
          <Button id="buttons.logout" onClick={handleLogout}>
            {i18n.t("buttons.logout")}
          </Button>
          <Button id="buttons.continue" onClick={handleContinue}>
            {i18n.t("buttons.continue")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  ) : null;
}

SessionTimeoutDialog.displayName = NAME;

export default SessionTimeoutDialog;
