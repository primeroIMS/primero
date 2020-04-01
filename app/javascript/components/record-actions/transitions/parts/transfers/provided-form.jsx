import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { FormControlLabel, Grid } from "@material-ui/core";
import { Field } from "formik";
import { useDispatch } from "react-redux";

import { CasesIcon } from "../../../../../images/primero-icons";
import { useI18n } from "../../../../i18n";
import * as styles from "../../styles.css";

import { PROVIDED_FORM_NAME as NAME } from "./constants";
import onChangeTransferAnyway from "./on-change-transfer-anyway";

const ProvidedForm = ({ setDisabled, canConsentOverride, recordType }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const dispatch = useDispatch();

  const fieldTransferAnyway = (
    <Field
      name="transfer"
      render={props =>
        onChangeTransferAnyway(props, dispatch, setDisabled, recordType)
      }
    />
  );

  const transferAnyway = canConsentOverride ? (
    <FormControlLabel
      control={fieldTransferAnyway}
      label={i18n.t("transfer.transfer_label")}
    />
  ) : null;

  return (
    <div className={css.alertTransferModal}>
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <Grid item xs={2} className={css.alignCenter}>
          <CasesIcon className={css.alertTransferModalIcon} />
        </Grid>
        <Grid item xs={10}>
          <span>{i18n.t("transfer.provided_consent_label")}</span>
          <br />
          {transferAnyway}
        </Grid>
      </Grid>
    </div>
  );
};

ProvidedForm.displayName = NAME;

ProvidedForm.propTypes = {
  canConsentOverride: PropTypes.bool,
  recordType: PropTypes.string,
  setDisabled: PropTypes.func
};

export default ProvidedForm;
