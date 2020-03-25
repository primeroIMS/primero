import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";

import { getProtectionConcerns } from "../../selectors";
import { useI18n } from "../../../../i18n";
import { toProtectionConcernTable } from "../../helpers";
import Permission from "../../../../application/permission";
import { RESOURCES, ACTIONS } from "../../../../../libs/permissions";
import { OptionsBox, DashboardTable } from "../../../../dashboard";
import { getOption } from "../../../../record-form";
import { LOOKUPS } from "../../../../../config";

import { NAME } from "./constants";

const Component = ({ loadingIndicator }) => {
  const i18n = useI18n();

  const protectionConcerns = useSelector(state => getProtectionConcerns(state));
  const protectionConcernsLookup = useSelector(state =>
    getOption(state, LOOKUPS.protection_concerns, i18n.locale)
  );

  return (
    <Permission
      resources={RESOURCES.dashboards}
      actions={ACTIONS.DASH_PROTECTION_CONCERNS}
    >
      <Grid item xl={9} md={8} xs={12}>
        <OptionsBox
          title={i18n.t("dashboard.protection_concerns")}
          hasData={Boolean(protectionConcerns.size)}
          {...loadingIndicator}
        >
          <DashboardTable
            {...toProtectionConcernTable(
              protectionConcerns,
              i18n,
              protectionConcernsLookup
            )}
          />
        </OptionsBox>
      </Grid>
    </Permission>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  loadingIndicator: PropTypes.object
};

export default Component;
