import { Divider, Grid, FormControlLabel } from "@material-ui/core";
import PropTypes from "prop-types";

import { useI18n } from "../../i18n";
import DisplayData from "../../display-data";
import css from "../styles.css";
import DateTransitions from "../components/date-transitions";

import { NAME } from "./constants";
import renderIconValue from "./render-icon-value";

const TransferDetails = ({ transition }) => {
  const i18n = useI18n();

  const renderRejected =
    transition.status === "rejected" ? (
      <Grid item md={12} xs={12}>
        <DisplayData label="transition.rejected" value={transition.rejected_reason} />
      </Grid>
    ) : null;

  return (
    <Grid container spacing={2}>
      <Grid item md={6} xs={12}>
        <DisplayData label="transition.recipient" value={transition.transitioned_to} />
      </Grid>
      <Grid item md={6} xs={12}>
        <DisplayData label="transition.assigned_by" value={transition.transitioned_by} />
      </Grid>

      <Grid item md={6} xs={12}>
        <DisplayData
          label="transition.no_consent_share"
          value={
            <div className={css.transtionIconValue}>
              <FormControlLabel
                control={renderIconValue(transition.consent_overridden, css.successIcon)}
                label={
                  <div className={css.transtionValue}>
                    {i18n.t(`transition.consent_overridden_value.${transition.consent_overridden}_label`)}
                  </div>
                }
              />
            </div>
          }
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <DisplayData
          label="transition.individual_consent"
          value={
            <div className={css.transtionIconValue}>
              <FormControlLabel
                control={renderIconValue(transition.consent_individual_transfer, css.successIcon)}
                label={
                  <div className={css.transtionValue}>
                    {i18n.t(
                      `transition.consent_individual_transfer_value.${transition.consent_individual_transfer}_label`
                    )}
                  </div>
                }
              />
            </div>
          }
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <DateTransitions
          valueWithTime
          name="responded_at"
          label="transition.responded_at"
          value={transition.responded_at}
        />
      </Grid>
      {renderRejected}
      <Grid item md={12} xs={12}>
        <Divider className={css.divider} />
        <DisplayData label="transition.notes" value={transition.notes} />
      </Grid>
    </Grid>
  );
};

TransferDetails.displayName = NAME;

TransferDetails.propTypes = {
  transition: PropTypes.object.isRequired
};

export default TransferDetails;
