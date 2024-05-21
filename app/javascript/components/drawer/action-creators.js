// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { SET_DRAWER, TOGGLE_DRAWER } from "./actions";

export const setDrawer = payload => ({
  type: SET_DRAWER,
  payload
});

export const toggleDrawer = payload => ({
  type: TOGGLE_DRAWER,
  payload
});
