/* eslint-disable import/prefer-default-export */

import { ACTION_BUTTON_TYPES } from "./constants";
import { DefaultButton, IconButton } from "./components";

export const buttonType = type => {
  switch (type) {
    case ACTION_BUTTON_TYPES.default:
      return DefaultButton;
    case ACTION_BUTTON_TYPES.icon:
      return IconButton;
    default:
      return null;
  }
};
