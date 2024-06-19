// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable max-len */
import { withStyles } from "tss-react/mui";
import { Switch } from "@mui/material";

const ToggleSwitch = withStyles(Switch, () => ({
  switchBase: {
    "&.Mui-checked": {
      color: "#fff",
      "& .MuiSwitch-thumb": {
        backgroundColor: "var(--c-gold-yellow)"
      },
      "& + .MuiSwitch-track": {
        opacity: 0.5,
        backgroundColor: "var(--c-gold-yellow)"
      }
    }
  },
  thumb: {
    backgroundColor: "var(--c-grey)"
  },
  track: {
    opacity: 1,
    backgroundColor: "#aab4be"
  }
}));

export default ToggleSwitch;
