import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Grid, List } from "@material-ui/core";

import { getDashboardFlags } from "../../selectors";
import { useI18n } from "../../../../i18n";
import Permission from "../../../../application/permission";
import { RESOURCES, ACTIONS } from "../../../../../libs/permissions";
import { OptionsBox, FlagBox } from "../../../../dashboard";

import { NAME } from "./constants";

const Component = ({ loadingIndicator }) => {
  const i18n = useI18n();
  const flags = useSelector(state => getDashboardFlags(state));

  return (
    <Permission resources={RESOURCES.cases} actions={[ACTIONS.READ, ACTIONS.MANAGE]}>
      <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_FLAGS}>
        <Grid item xl={3} md={4} xs={12}>
          <OptionsBox title={i18n.t("dashboard.flagged_cases")} hasData={Boolean(flags.size)} {...loadingIndicator}>
            {/* TODO: Move this to FlagBox */}
            <List>
              {flags.map(flag => {
                return <FlagBox flag={flag} />;
              })}
            </List>
          </OptionsBox>
        </Grid>
      </Permission>
    </Permission>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  loadingIndicator: PropTypes.object
};

export default Component;
