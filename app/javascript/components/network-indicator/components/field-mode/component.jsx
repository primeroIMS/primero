import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";

import { useI18n } from "../../../i18n";
import { setUserToggleOffline } from "../../../connectivity/action-creators";
import ListIcon from "../../../list-icon";
import { useMemoizedSelector } from "../../../../libs";
import { getFieldMode } from "../../../application/selectors";
import ToggleSwitch from "../toggle-switch/component";

import css from "./styles.css";

function Component() {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const fieldMode = useMemoizedSelector(state => getFieldMode(state));

  const [fieldModeStatus, setFieldModeStatus] = useState(localStorage.getItem("fieldMode") === "true");

  const setFieldMode = checked => {
    setFieldModeStatus(checked);

    dispatch(setUserToggleOffline(checked));
  };

  useEffect(() => {
    localStorage.setItem("fieldMode", fieldModeStatus);
  }, [fieldModeStatus]);

  useEffect(() => {
    dispatch(setUserToggleOffline(fieldModeStatus));
  }, []);

  if (!fieldMode) {
    return false;
  }

  const handleStatusChange = event => {
    const { checked } = event.target;

    setFieldMode(checked);
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
  }[fieldModeStatus];

  return (
    <ListItem classes={{ root: css.container }}>
      <ListItemIcon className={css.icon}>
        <ListIcon icon={mode.icon} />
      </ListItemIcon>
      <ListItemText classes={{ primary: css.listText }}>{i18n.t("field_mode", { mode: mode.text })}</ListItemText>
      <ToggleSwitch color="default" onChange={handleStatusChange} checked={fieldModeStatus} />
    </ListItem>
  );
}

Component.displayName = "FieldMode";

export default Component;
