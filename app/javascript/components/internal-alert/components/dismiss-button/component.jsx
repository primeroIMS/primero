import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";

import css from "./styles.css";

const Component = ({ handler }) => {
  const handlerWrapper = event => {
    event.stopPropagation();
    handler();
  };

  return (
    <IconButton className={css.dismissButton} onClick={handlerWrapper}>
      <CloseIcon />
    </IconButton>
  );
};

Component.displayName = "InternalAlertDismissButton";
Component.propTypes = {
  handler: PropTypes.func.isRequired
};
export default Component;
