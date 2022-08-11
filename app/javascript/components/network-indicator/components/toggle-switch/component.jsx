/* eslint-disable max-len */
import { withStyles } from "@material-ui/core/styles";
import { Switch } from "@material-ui/core";

const ToggleSwitch = withStyles({
  width: 62,
  height: 34,
  padding: 7,
  switchBase: {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb": {
        backgroundColor: "var(--c-gold-yellow)"
      },
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 48 48"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M41.85 46.1 30.9 35.15 24 42 0 18q1.75-1.65 3.8-3.175T7.95 12.2L2.5 6.75l2.1-2.1L43.95 44Zm-6.8-15.15-21.3-21.3q2.35-.85 5-1.25T24 8q6.8 0 12.975 2.65T48 18Z"/></svg>')`
      },
      "& + .MuiSwitch-track": {
        opacity: 0.5,
        backgroundColor: "var(--c-gold-yellow)"
      }
    }
  },
  thumb: {
    backgroundColor: "var(--c-grey)",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 48 48"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M24 42 0 18q4.95-4.7 11.05-7.35Q17.15 8 24 8t12.95 2.65Q43.05 13.3 48 18Z"/></svg>')`
    }
  },
  track: {
    opacity: 1,
    backgroundColor: "#aab4be",
    borderRadius: 20 / 2
  }
})(Switch);

export default ToggleSwitch;
