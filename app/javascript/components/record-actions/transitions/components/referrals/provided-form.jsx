import React from "react";
import PropTypes from "prop-types";
import { Grid, FormControlLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Field } from "formik";

import { useI18n } from "../../../../i18n";
import { CasesIcon } from "../../../../../images/primero-icons";
import styles from "../../styles.css";

import { PROVIDED_FORM_NAME as NAME } from "./constants";
import onChangeReferAnyway from "./on-change-refer-anyway";

const ProvidedForm = ({ setDisabled, canConsentOverride }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  const fieldReferAnyway = (
    <Field
      name="referral"
      render={props => onChangeReferAnyway(props, setDisabled)}
    />
  );

  const referAnyway = canConsentOverride ? (
    <FormControlLabel
      control={fieldReferAnyway}
      label={i18n.t("referral.refer_anyway_label")}
    />
  ) : null;

  return (
    <div className={css.alertTransferModal}>
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <Grid item xs={2} className={css.alignCenter}>
          <CasesIcon className={css.alertTransferModalIcon} />
        </Grid>
        <Grid item xs={10}>
          <span>{i18n.t("referral.provided_consent_label")}</span>
          <br />
          {referAnyway}
        </Grid>
      </Grid>
    </div>
  );
};

ProvidedForm.displayName = NAME;

ProvidedForm.propTypes = {
  canConsentOverride: PropTypes.bool,
  setDisabled: PropTypes.func
};

export default ProvidedForm;
