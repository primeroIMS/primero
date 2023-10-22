import PropTypes from "prop-types";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import css from "./styles.css";

const Component = ({ item }) => {
  const renderDismissButton = handler => {
    return (
      <IconButton className={css.dismissButton} onClick={handler}>
        <CloseIcon />
      </IconButton>
    );
  };

  return (
    <div className={css.alertItemElement}>
      <span>{item.get("message")}</span>
      {item.get("onDismiss") && renderDismissButton(item.get("onDismiss"))}
    </div>
  );
};

Component.displayName = "InternalAlertItem";
Component.propTypes = {
  item: PropTypes.object.isRequired
};

export default Component;
