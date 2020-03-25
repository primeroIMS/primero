import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";

import { getWorkflowIndividualCases } from "../../selectors";
import { useI18n } from "../../../../i18n";
import { toData1D } from "../../helpers";
import Permission from "../../../../application/permission";
import { selectModule } from "../../../../application";
import { RESOURCES, ACTIONS } from "../../../../../libs/permissions";
import { OptionsBox, PieChart } from "../../../../dashboard";
import { MODULES, RECORD_TYPES } from "../../../../../config";

import { NAME } from "./constants";

const Component = ({ loadingIndicator }) => {
  const i18n = useI18n();
  const workflowLabels = useSelector(
    state =>
      selectModule(state, MODULES.CP)?.workflows?.[RECORD_TYPES.cases]?.[
        i18n.locale
      ]
  );
  const casesWorkflow = useSelector(state => getWorkflowIndividualCases(state));
  const casesWorkflowProps = {
    ...toData1D(casesWorkflow, workflowLabels)
  };

  return (
    <Permission
      resources={RESOURCES.dashboards}
      actions={ACTIONS.DASH_WORKFLOW}
    >
      <Grid item xl={3} md={4} xs={12}>
        <OptionsBox
          title={i18n.t("dashboard.workflow")}
          hasData={Boolean(casesWorkflow.size)}
          {...loadingIndicator}
        >
          <PieChart {...casesWorkflowProps} />
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
