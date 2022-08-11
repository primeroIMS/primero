import { ListItem, ListItemIcon, ListItemText, Switch } from "@material-ui/core";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { useI18n } from "../../../i18n";
import { setUserToggleOffline } from "../../../connectivity/action-creators";
import ListIcon from "../../../list-icon";
import { useMemoizedSelector } from "../../../../libs";
import { getFieldMode } from "../../../application/selectors";

import css from "./styles.css";

function Component() {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const fieldMode = useMemoizedSelector(state => getFieldMode(state));

  const [isChecked, setIsChecked] = useState(false);

  if (!fieldMode) {
    return false;
  }

  const handleStatusChange = event => {
    const { checked } = event.target;

    setIsChecked(checked);
    dispatch(setUserToggleOffline(checked));
  };

  const mode = {
    [true]: {
      text: i18n.t("field_mode_on"),
      icon: "disconnected",
      color: "primary"
    },
    [false]: {
      text: i18n.t("field_mode_off"),
      icon: "connected",
      color: "action"
    }
  }[isChecked];

  return (
    <ListItem classes={{ root: css.container }}>
      <ListItemIcon className={css.icon}>
        <ListIcon icon={mode.icon} />
      </ListItemIcon>
      <ListItemText classes={{ primary: css.listText }}>{i18n.t("field_mode", { mode: mode.text })}</ListItemText>
      <Switch onChange={handleStatusChange} value={isChecked} />
    </ListItem>
  );
}

Component.displayName = "FieldMode";

export default Component;
