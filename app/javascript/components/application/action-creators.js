// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { batch } from "react-redux";

import { DB_COLLECTIONS_NAMES } from "../../db";
import { fetchForms, fetchOptions } from "../record-form/action-creators";
import { RECORD_PATH, ROUTES } from "../../config/constants";
import { fetchContactInformation } from "../contact-information/action-creators";

import actions from "./actions";

export const fetchSystemSettings = () => ({
  type: actions.FETCH_SYSTEM_SETTINGS,
  api: {
    path: "system_settings",
    params: { extended: true },
    db: {
      collection: DB_COLLECTIONS_NAMES.SYSTEM_SETTINGS
    }
  }
});

export const fetchSystemPermissions = () => ({
  type: actions.FETCH_SYSTEM_PERMISSIONS,
  api: {
    path: "permissions",
    db: {
      collection: DB_COLLECTIONS_NAMES.PERMISSIONS
    }
  }
});

export const fetchRoles = () => ({
  type: actions.FETCH_ROLES,
  api: {
    path: RECORD_PATH.roles
  }
});

export const fetchWebpushConfig = () => ({
  type: actions.FETCH_WEBPUSH_CONFIG,
  api: {
    path: RECORD_PATH.webpush_config
  }
});

export const fetchManagedRoles = () => ({
  type: actions.FETCH_MANAGED_ROLES,
  api: {
    path: RECORD_PATH.roles,
    params: { external: true }
  }
});

export const fetchReferralAuthorizationRoles = () => ({
  type: actions.FETCH_REFERRAL_AUTHORIZATION_ROLES,
  api: {
    path: RECORD_PATH.roles,
    params: { referral_authorization: true }
  }
});

export const fetchUserGroups = () => ({
  type: actions.FETCH_USER_GROUPS,
  api: {
    path: RECORD_PATH.user_groups
  }
});

export const loadApplicationResources = () => dispatch => {
  batch(() => {
    dispatch(fetchContactInformation());
    dispatch(fetchSystemSettings());
    dispatch(fetchSystemPermissions());
    dispatch(fetchForms());
    dispatch(fetchOptions());
    dispatch(fetchWebpushConfig());
  });
};

export const setUserIdle = payload => ({
  type: actions.SET_USER_IDLE,
  payload
});

export const disableNavigation = payload => ({
  type: actions.DISABLE_NAVIGATION,
  payload
});

export const fetchSandboxUI = () => ({
  type: actions.FETCH_SANDBOX_UI,
  api: {
    path: ROUTES.sandbox_ui,
    db: {
      collection: DB_COLLECTIONS_NAMES.PRIMERO
    }
  }
});

export const fetchAgencyLogoOptions = () => ({
  type: actions.FETCH_AGENCY_LOGO_OPTIONS,
  api: {
    db: {
      collection: DB_COLLECTIONS_NAMES.PRIMERO,
      params: { pdfLogoOption: true }
    }
  }
});

export const setReturnUrl = payload => ({
  type: actions.SET_RETURN_URL,
  payload
});

export const setTheme = payload => ({
  type: actions.SET_THEME,
  payload
});
