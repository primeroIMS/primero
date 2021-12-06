/* eslint-disable import/prefer-default-export */

import { ACTION_BUTTON_TYPES } from "./constants";
import { DefaultButton, IconButton, Link } from "./components";

export const buttonType = type => {
  switch (type) {
    case ACTION_BUTTON_TYPES.default:
      return DefaultButton;
    case ACTION_BUTTON_TYPES.icon:
      return IconButton;
    case ACTION_BUTTON_TYPES.link:
      return Link;
    default:
      return null;
  }
};
