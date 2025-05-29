// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { getIsDashboardGroupLoading, getWorkflowIndividualCases } from "../../selectors";
import { useI18n } from "../../../../i18n";
import Permission, { RESOURCES, ACTIONS } from "../../../../permissions";
import { OptionsBox } from "../../../../dashboard";
import { RECORD_TYPES } from "../../../../../config";
import { useMemoizedSelector } from "../../../../../libs";
import css from "../styles.css";
import { getAllWorkflowLabels } from "../../../../application/selectors";
import { DASHBOARD_GROUP } from "../../constants";

import { NAME, CLOSED } from "./constants";
import WorkFlowStep from "./components";

function Component() {
  const i18n = useI18n();

  const loading = useMemoizedSelector(state => getIsDashboardGroupLoading(state, DASHBOARD_GROUP.workflow));
  const workflowLabels = useMemoizedSelector(state => getAllWorkflowLabels(state, RECORD_TYPES.cases));
  const casesWorkflow = useMemoizedSelector(state => getWorkflowIndividualCases(state));
  const hasData = Boolean(casesWorkflow.size) && !loading;

  const renderSteps = (workflow, moduleID) =>
    workflow
      .filter(step => step.id !== CLOSED)
      .map(step => {
        return <WorkFlowStep step={step} casesWorkflow={casesWorkflow} i18n={i18n} key={step.id} moduleID={moduleID} />;
      });

  function panelTitle(name) {
    const title = [i18n.t("dashboard.workflow")];

    if (workflowLabels.length > 1) {
      title.push(`- ${name}`);
    }

    return title.join(" ");
  }

  return (
    <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_WORKFLOW}>
      {workflowLabels.map(([name, workflow, moduleID]) => (
        <OptionsBox title={panelTitle(name)} hasData={hasData} loading={loading}>
          <div className={css.container}>{renderSteps(workflow, moduleID)}</div>
        </OptionsBox>
      ))}
    </Permission>
  );
}

Component.displayName = NAME;

export default Component;
