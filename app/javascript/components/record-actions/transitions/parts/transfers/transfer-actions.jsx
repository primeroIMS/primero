import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { useI18n } from "components/i18n";
import { Box, Button } from "@material-ui/core";
import styles from "../../styles.css";

const TransferActions = ({ closeModal }) => {
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
      >
        {i18n.t("transfer.submit_label")}
      </Button>
      <Button onClick={closeModal} color="primary" variant="outlined">
        {i18n.t("buttons.cancel")}
      </Button>
    </Box>
  );
};

TransferActions.propTypes = {
  closeModal: PropTypes.func
};

export default TransferActions;
