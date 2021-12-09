import { Divider, Grid, FormControlLabel } from "@material-ui/core";
import PropTypes from "prop-types";

import { getOption } from "../../record-form";
import DisplayData from "../../display-data";
import { useI18n } from "../../i18n";
import { REFERRAL_DETAILS_NAME, TRANSITION_STATUS } from "../constants";
import { DATE_TIME_FORMAT, LOOKUPS } from "../../../config";
import { OPTION_TYPES } from "../../form";
import { useMemoizedSelector } from "../../../libs";
import useOptions from "../../form/use-options";

import renderIconValue from "./render-icon-value";
import { referralAgencyName } from "./utils";

const Details = ({ transition, classes }) => {
  const i18n = useI18n();

  const service = useMemoizedSelector(state => {
    const value = getOption(state, LOOKUPS.service_type, i18n.locale).filter(
      option => option.id === transition.service
    );

    // eslint-disable-next-line camelcase
    return value[0]?.display_text;
  });
  const agencies = useOptions({ source: OPTION_TYPES.AGENCY, useUniqueId: true });

  const agencyName = referralAgencyName(transition, agencies);

  const renderRejected =
    transition.status === TRANSITION_STATUS.rejected ? (
      <Grid item md={12} xs={12}>
        <DisplayData label="transition.rejected" value={transition.rejected_reason} />
      </Grid>
    ) : null;

  const renderRespondedAt = transition.responded_at ? (
    <Grid item md={6} xs={12}>
      <DisplayData
        label="transition.responded_at"
        value={i18n.localizeDate(transition.responded_at, DATE_TIME_FORMAT)}
      />
    </Grid>
  ) : null;

  return (
    <Grid container spacing={2}>
      <Grid item md={6} xs={12}>
        <DisplayData
          label="transition.recipient"
          value={transition.transitioned_to || transition.transitioned_to_remote}
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <DisplayData label="transition.assigned_by" value={transition.transitioned_by} />
      </Grid>

      <Grid item md={6} xs={12}>
        <DisplayData
          label="transition.no_consent_share"
          value={
            <div className={classes.transtionIconValue}>
              <FormControlLabel
                control={renderIconValue(transition.consent_overridden, classes.successIcon)}
                label={
                  <div className={classes.transtionValue}>
                    {i18n.t(`transition.consent_overridden_value.${transition.consent_overridden}_label`)}
                  </div>
                }
              />
            </div>
          }
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <DisplayData label="transition.service_label" value={service} />
      </Grid>
      <Grid item md={6} xs={12}>
        <DisplayData label="transition.agency_label" value={agencyName} />
      </Grid>
      {renderRespondedAt}
      {renderRejected}
      <Grid item md={12} xs={12}>
        <Divider className={classes.divider} />
        <DisplayData label="referral.notes_label" value={transition.notes} />
      </Grid>
      {transition.rejection_note && (
        <Grid item md={12} xs={12}>
          <Divider className={classes.divider} />
          <DisplayData label="referral.note_on_referral_from_provider" value={transition.rejection_note} />
        </Grid>
      )}
    </Grid>
  );
};

Details.displayName = REFERRAL_DETAILS_NAME;

Details.propTypes = {
  classes: PropTypes.object.isRequired,
  transition: PropTypes.object.isRequired
};

export default Details;
