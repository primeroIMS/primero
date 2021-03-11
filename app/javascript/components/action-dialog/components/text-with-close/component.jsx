import PropTypes from "prop-types";
import CloseIcon from "@material-ui/icons/Close";
import { DialogTitle, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { NAME } from "./constants";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Component = ({ dialogTitle, dialogSubtitle, closeHandler, dialogActions, disableClose }) => {
  const css = useStyles();
  const subtitle = dialogSubtitle ? <span className={css.dialogSubtitle}>{dialogSubtitle}</span> : null;

  return (
    <DialogTitle>
      <div className={css.dialogTitle}>
        <div>
          {dialogTitle}
          {subtitle}
        </div>
        <div>{dialogActions}</div>
        {disableClose || (
          <div>
            <IconButton aria-label="close" className={css.closeButton} onClick={closeHandler}>
              <CloseIcon />
            </IconButton>
          </div>
        )}
      </div>
    </DialogTitle>
  );
};

Component.defaultProps = {
  disableClose: false
};

Component.propTypes = {
  closeHandler: PropTypes.func.isRequired,
  dialogActions: PropTypes.object,
  dialogSubtitle: PropTypes.string,
  dialogTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  disableClose: PropTypes.bool
};

Component.displayName = NAME;

export default Component;
