// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useTheme } from "@mui/styles";
import { useMediaQuery } from "@mui/material";
import merge from "lodash/merge";
import isFunction from "lodash/isFunction";

import { getAppDirection } from "../components/i18n/selectors";
import { ORIENTATION } from "../components/i18n/constants";

import useMemoizedSelector from "./use-memoized-selector";

export default ({ overrides = {} } = {}) => {
  const appTheme = useTheme();

  const themeOverrides = isFunction(overrides) ? overrides(appTheme) : overrides;
  const mobileDisplay = useMediaQuery(appTheme.breakpoints.down("sm"));
  const theme = merge(appTheme, themeOverrides);

  const direction = useMemoizedSelector(state => getAppDirection(state));

  const isRTL = direction === ORIENTATION.rtl;

  return {
    isRTL,
    theme,
    mobileDisplay
  };
};
