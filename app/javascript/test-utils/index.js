// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/no-multi-comp */

export { render, fireEvent, screen, waitFor, within, cleanup, act } from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
export { createMockStore, DEFAULT_STATE } from "./create-mock-store";
export { default as mountedComponent } from "./mounted-component";
export { default as translateOptions } from "./translate-options";
export { default as tick } from "./tick";
export { default as createMiddleware } from "./create-middleware";
export { default as mountedThemeComponent } from "./mounted-theme-component";
export { default as simpleMountedComponent } from "./simple-mounted-component";
export { mountedFieldComponent, mountedFormComponent } from "./mounted-form-component";
export { default as setupHook } from "./setup-hook";
export { abbrMonthNames, freezeTimeZone } from "./i18n";
export { expectNever } from "./utils";
export { default as setScreenSizeToMobile } from "./set-screen-size-to-mobile";
export { default as setSelectValue } from "./set-select-value";
export { mockFetchSuccess, mockFetchError } from "./fetch-helpers";
export { listHeaders, lookups } from "./fixtures";
