import React, { useState } from "react";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { CasesIcon } from "../../../../../images/primero-icons";
import { useI18n } from "../../../../i18n";
import * as styles from "../../styles.css";

import { BULK_TRANSFER_NAME as NAME } from "./constants";
import TransferCheckbox from "./transfer-checkbox";

const BulkTransfer = ({ isBulkTransfer }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const [state, setState] = useState(false);

  if (!isBulkTransfer) {
    return null;
  }

  return (
    <div className={css.alertTransferModal}>
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <Grid item xs={2} className={css.alignCenter}>
          <CasesIcon className={css.alertTransferModalIcon} />
        </Grid>
        <Grid item xs={10}>
          <span>{i18n.t("transfer.consent_label")}</span>
          <br />
          <TransferCheckbox
            checked={state}
            onChange={() => setState(!state)}
            label={i18n.t("transfer.consent_override_label")}
          />
        </Grid>
      </Grid>
    </div>
  );
};

BulkTransfer.displayName = NAME;

BulkTransfer.propTypes = {
  isBulkTransfer: PropTypes.bool
};

export default BulkTransfer;
