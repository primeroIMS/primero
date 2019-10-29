import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { FormControlLabel, Checkbox, Grid } from "@material-ui/core";
import { Field } from "formik";
import { CasesIcon } from "images/primero-icons";
import { useI18n } from "components/i18n";
import * as styles from "../../styles.css";

const ProvidedForm = ({ setDisabled, canConsentOverride }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const onChange = (field, form) => {
    setDisabled(!field.value);
    form.setFieldValue(field.name, !field.value, false);
  };

  const onChangeTransferAnyway = props => {
    const { field, form } = props;
    const { value } = field;
    return <Checkbox checked={value} onChange={() => onChange(field, form)} />;
  };

  const transferAnyway = canConsentOverride ? (
    <FormControlLabel
      control={
        <Field
          name="transfer"
          render={props => onChangeTransferAnyway(props)}
        />
      }
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
  setDisabled: PropTypes.func
};

export default ProvidedForm
