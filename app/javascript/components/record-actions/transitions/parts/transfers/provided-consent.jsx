import React from "react";
import PropTypes from "prop-types";
import { useI18n } from "components/i18n";
import { makeStyles } from "@material-ui/core/styles";
import { FormControlLabel, Checkbox, Grid } from "@material-ui/core";
import { Field } from "formik";
import { CasesIcon } from "images/primero-icons";
import * as styles from "../../styles.css";

const ProvidedConsent = ({
  canConsentOverride,
  providedConsent,
  setDisabled
}) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const canDisplay = canConsentOverride && !providedConsent;

  if (!canDisplay) {
    return null;
  }

  const ProvidedConsentForm = () => {
    const onChange = (field, form) => {
      setDisabled(!field.value);
      form.setFieldValue(field.name, !field.value, false);
    };
    return (
      <div className={css.alertTransferModal}>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <Grid item xs={1}>
            <CasesIcon className={css.alertTransferModalIcon} />
          </Grid>
          <Grid item xs={11}>
            <span>{i18n.t("transfer.provided_consent_label")}</span>
            <br />
            <FormControlLabel
              control={
                <Field
                  name="transfer"
                  render={({ field, form }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={() => onChange(field, form)}
                    />
                  )}
                />
              }
              label={i18n.t("transfer.transfer_label")}
            />
          </Grid>
        </Grid>
      </div>
    );
  };

  return <ProvidedConsentForm />;
};

ProvidedConsent.propTypes = {
  canConsentOverride: PropTypes.bool,
  providedConsent: PropTypes.bool,
  setDisabled: PropTypes.func
};

export default ProvidedConsent;
