// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Grid, FormControlLabel } from "@mui/material";
import { Field } from "formik";

import { useI18n } from "../../../../i18n";
import { CasesIcon } from "../../../../../images/primero-icons";
import css from "../../styles.css";

import { PROVIDED_FORM_NAME as NAME } from "./constants";
import onChangeReferAnyway from "./on-change-refer-anyway";

const ProvidedForm = ({ setDisabled, canConsentOverride }) => {
  const i18n = useI18n();

  const fieldReferAnyway = (
    <Field data-testid="field" name="referral">
      {props => onChangeReferAnyway(props, setDisabled)}
    </Field>
  );

  const referAnyway = canConsentOverride ? (
    <FormControlLabel
      data-testid="form-control"
      control={fieldReferAnyway}
      label={i18n.t("referral.refer_anyway_label")}
    />
  ) : null;

  return (
    <div className={css.alertTransferModal}>
      <Grid data-testid="grid" container direction="row" justify="flex-start" alignItems="center">
        <Grid data-testid="grid" item xs={2} className={css.alignCenter}>
          <CasesIcon className={css.alertTransferModalIcon} />
        </Grid>
        <Grid data-testid="grid" item xs={10}>
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
