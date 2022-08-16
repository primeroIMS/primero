/* eslint-disable max-len */
import { withStyles } from "@material-ui/core/styles";
import { Switch } from "@material-ui/core";

const ToggleSwitch = withStyles({
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
})(Switch);

export default ToggleSwitch;
