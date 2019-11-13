import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { FormControlLabel, Checkbox, Grid } from "@material-ui/core";
import { Field } from "formik";
import { useDispatch } from "react-redux";

import { CasesIcon } from "../../../../../images/primero-icons";
import { useI18n } from "../../../../i18n";
import * as styles from "../../styles.css";
import { internalFieldsDirty } from "../helpers";
import { fetchReferralUsers } from "../../action-creators";
import { RECORD_TYPES } from "../../../../../config";

import {
  AGENCY_FIELD,
  LOCATION_FIELD,
  TRANSITIONED_TO_FIELD
} from "./constants";

const ProvidedForm = ({ setDisabled, canConsentOverride, recordType }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const dispatch = useDispatch();

  const onChange = (field, form) => {
    if (
        internalFieldsDirty(form.values, [
          AGENCY_FIELD,
          LOCATION_FIELD,
          TRANSITIONED_TO_FIELD
        ])
      ) {
        dispatch(fetchReferralUsers({ record_type: RECORD_TYPES[recordType] }))
      }
    setDisabled(!field.value);
    form.setFieldValue(field.name, !field.value, false);
  };

  const onChangeTransferAnyway = props => {
    const { field, form } = props;
    const { value } = field;

    return <Checkbox checked={value} onChange={() => onChange(field, form)} />;
  };

  const fieldTransferAnyway = (
    <Field name="transfer" render={props => onChangeTransferAnyway(props)} />
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
        <Grid item xs={1}>
          <CasesIcon className={css.alertTransferModalIcon} />
        </Grid>
        <Grid item xs={11}>
          <span>{i18n.t("transfer.provided_consent_label")}</span>
          <br />
          {transferAnyway}
        </Grid>
      </Grid>
    </div>
  );
};

ProvidedForm.propTypes = {
  canConsentOverride: PropTypes.bool,
  recordType: PropTypes.string,
  setDisabled: PropTypes.func
};

export default ProvidedForm;
