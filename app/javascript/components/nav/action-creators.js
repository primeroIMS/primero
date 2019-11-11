import { OPEN_DRAWER } from "./actions";

export const openDrawer = payload => {
  return {
    type: OPEN_DRAWER,
    payload
  };
};
