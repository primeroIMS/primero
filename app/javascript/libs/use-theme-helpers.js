// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { createTheme, useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import isFunction from "lodash/isFunction";

import { getAppDirection } from "../components/i18n/selectors";
import { ORIENTATION } from "../components/i18n/constants";

import useMemoizedSelector from "./use-memoized-selector";

export default ({ overrides = {} } = {}) => {
  const appTheme = useTheme();

  const themeOverrides = isFunction(overrides) ? overrides(appTheme) : overrides;
  const mobileDisplay = useMediaQuery(appTheme.breakpoints.down("sm"));
  const tabletDisplay = useMediaQuery(appTheme.breakpoints.down("md"));
  const theme = createTheme(appTheme, themeOverrides);

  const direction = useMemoizedSelector(state => getAppDirection(state));

  const isRTL = direction === ORIENTATION.rtl;

  return {
    isRTL,
    theme,
    mobileDisplay,
    tabletDisplay
  };
};
