import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button } from "@material-ui/core";

import styles from "../../styles.css";
import { TRANSFER_ACTIONS_NAME } from "../../constants";
import { useI18n } from "../../../../i18n";

const TransferActions = ({ closeModal, disabled }) => {
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
        {i18n.t("transfer.submit_label")}
      </Button>
      <Button onClick={closeModal} color="primary" variant="outlined">
        {i18n.t("buttons.cancel")}
      </Button>
    </Box>
  );
};

TransferActions.displayName = TRANSFER_ACTIONS_NAME;

TransferActions.propTypes = {
  closeModal: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default TransferActions;
