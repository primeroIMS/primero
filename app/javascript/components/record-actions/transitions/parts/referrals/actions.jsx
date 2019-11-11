import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button } from "@material-ui/core";

import styles from "../../styles.css";
import { REFERRAL_ACTIONS_NAME } from "../../constants";

import { useI18n } from "components/i18n";

const Actions = ({ handleClose, disabled }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  return (
    <Box
      display="flex"
      my={3}
      justifyContent="flex-start"
      className={css.modalAction}
    >
      <Button
        type="submit"
        color="primary"
        variant="contained"
        className={css.modalActionButton}
        disabled={disabled}
      >
        {i18n.t("buttons.referral")}
      </Button>
      <Button onClick={handleClose} color="primary" variant="outlined">
        {i18n.t("buttons.cancel")}
      </Button>
    </Box>
  );
};

Actions.displayName = REFERRAL_ACTIONS_NAME;

Actions.propTypes = {
  disabled: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default Actions;
