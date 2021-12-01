import PropTypes from "prop-types";

import { getWorkflowIndividualCases } from "../../selectors";
import { useI18n } from "../../../../i18n";
import Permission from "../../../../application/permission";
import { selectModule } from "../../../../application";
import { RESOURCES, ACTIONS } from "../../../../../libs/permissions";
import { OptionsBox } from "../../../../dashboard";
import { MODULES, RECORD_TYPES } from "../../../../../config";
import { useMemoizedSelector } from "../../../../../libs";
import css from "../styles.css";

import { NAME, CLOSED } from "./constants";
import WorkFlowStep from "./components";

const Component = ({ loadingIndicator }) => {
  const i18n = useI18n();

  const workflowLabels = useMemoizedSelector(state => selectModule(state, MODULES.CP)?.workflows?.[RECORD_TYPES.cases]);
  const casesWorkflow = useMemoizedSelector(state => getWorkflowIndividualCases(state));

  const renderSteps = workflowLabels
    ?.filter(step => step.id !== CLOSED)
    ?.map(step => {
      return <WorkFlowStep step={step} casesWorkflow={casesWorkflow} i18n={i18n} key={step.id} />;
    });

  return (
    <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_WORKFLOW}>
      <OptionsBox title={i18n.t("dashboard.workflow")} hasData={Boolean(casesWorkflow.size)} {...loadingIndicator}>
        <div className={css.container}>{renderSteps}</div>
      </OptionsBox>
    </Permission>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  loadingIndicator: PropTypes.object
};

export default Component;
