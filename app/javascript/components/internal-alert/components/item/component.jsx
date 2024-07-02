import PropTypes from "prop-types";

import InternalAlertDismissButton from "../dismiss-button";

import css from "./styles.css";

function Component({ item }) {
  return (
    <div className={css.alertItemElement}>
      <span>{item.get("message")}</span>
      {item.get("onDismiss") && InternalAlertDismissButton({ handler: item.get("onDismiss") })}
    </div>
  );
}

Component.displayName = "InternalAlertItem";
Component.propTypes = {
  item: PropTypes.object.isRequired
};

export default Component;
