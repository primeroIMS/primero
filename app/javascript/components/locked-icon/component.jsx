import VpnKeyIcon from "@mui/icons-material/VpnKey";

import css from "./styles.css";

function Component() {
  return <VpnKeyIcon className={css.rotateIcon} data-testid="locked" />;
}

Component.displayName = "LockedIcon";

export default Component;
