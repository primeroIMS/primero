import React from "react";
import PropTypes from "prop-types";
import { Grid, FormControlLabel, Checkbox } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Field } from "formik";
import { useDispatch } from "react-redux";

import { useI18n } from "../../../../i18n";
import { CasesIcon } from "../../../../../images/primero-icons";
import styles from "../../styles.css";
import { internalFieldsDirty } from "../helpers";
import { fetchReferralUsers } from "../../action-creators";
import { RECORD_TYPES } from "../../../../../config";

import {
  SERVICE_FIELD,
  AGENCY_FIELD,
  LOCATION_FIELD,
  TRANSITIONED_TO_FIELD
} from "./constants";

const ProvidedForm = ({ setDisabled, canConsentOverride, recordType }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const dispatch = useDispatch();

  const onChangeReferAnyway = props => {
    const { field, form } = props;
    const { value } = field;
    const onChange = (fieldCheckbox, formCheckbox) => {
      if (
        internalFieldsDirty(formCheckbox.values, [
          SERVICE_FIELD,
          AGENCY_FIELD,
          LOCATION_FIELD,
          TRANSITIONED_TO_FIELD
        ])
      ) {
        dispatch(fetchReferralUsers({ record_type: RECORD_TYPES[recordType] }))
      }
      setDisabled(!fieldCheckbox.value);
      formCheckbox.setFieldValue(
        fieldCheckbox.name,
        !fieldCheckbox.value,
        false
      );
    };

    return <Checkbox checked={value} onChange={() => onChange(field, form)} />;
  };

  const fieldReferAnyway = (
    <Field name="referral" render={props => onChangeReferAnyway(props)} />
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
        <Grid item xs={1}>
          <CasesIcon className={css.alertTransferModalIcon} />
        </Grid>
        <Grid item xs={11}>
          <span>{i18n.t("referral.provided_consent_label")}</span>
          <br />
          {referAnyway}
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
