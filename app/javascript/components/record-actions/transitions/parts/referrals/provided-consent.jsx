import React from "react";
import PropTypes from "prop-types";
import { useI18n } from "components/i18n";
import { Grid, FormControlLabel, Checkbox } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CasesIcon } from "images/primero-icons";
import { Field } from "formik";
import styles from "../../styles.css";

const ProvidedConsent = ({
  canConsentOverride,
  providedConsent,
  setDisabled
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const canDisplay = canConsentOverride && !providedConsent;

  if (!canDisplay) {
    return null;
  }
  const ProvidedForm = () => {
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
            <span>{i18n.t("referral.provided_consent_label")}</span>
            <br />
            <FormControlLabel
              control={
                <Field
                  name="referral"
                  render={({ field, form }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={() => {
                        setDisabled(!field.value);
                        form.setFieldValue(field.name, !field.value, false);
                      }}
                    />
                  )}
                />
              }
              label={i18n.t("referral.refer_anyway_label")}
            />
          </Grid>
        </Grid>
      </div>
    );
  };

  return <ProvidedForm />;
};

ProvidedConsent.propTypes = {
  canConsentOverride: PropTypes.bool,
  providedConsent: PropTypes.bool,
  setDisabled: PropTypes.func
};

export default ProvidedConsent;
