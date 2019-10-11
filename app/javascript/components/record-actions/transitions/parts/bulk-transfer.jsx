import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { CasesIcon } from "images/primero-icons";
import { useI18n } from "components/i18n";
import { makeStyles } from "@material-ui/core/styles";
import TransferCheckbox from "./transfer-checkbox";
import * as styles from "../styles.css";

const BulkTransfer = () => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const [state, setState] = useState(false);

  return (
    <div className={css.alertTransferModal}>
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <Grid item xs={1}>
          <CasesIcon className={css.alertTransferModalIcon} />
        </Grid>
        <Grid item xs={11}>
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

export default BulkTransfer;
