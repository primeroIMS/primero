import PropTypes from "prop-types";
import clsx from "clsx";
import isEmpty from "lodash/isEmpty";
import { push } from "connected-react-router";
import { useDispatch } from "react-redux";

import { ROUTES } from "../../../../../../config";
import { buildFilter } from "../../../../../dashboard/utils";

import { NAME } from "./constants";

const WorkFlowStep = ({ step, casesWorkflow, css, i18n }) => {
  const dispatch = useDispatch();
  const getData = workflowStep =>
    (casesWorkflow.size > 0 && casesWorkflow.getIn(["indicators", "workflow", workflowStep], false)) || {};

  const workflowData = getData(step.id);
  const handleClick = query => {
    dispatch(
      push({
        pathname: ROUTES.cases,
        search: buildFilter(query)
      })
    );
  };
  const clickable = !isEmpty(workflowData) && workflowData?.count > 0;

  return (
    <div className={css.stepCases} icon={null}>
      <button
        className={clsx(css.itemButton, { [css.itemButtonClick]: clickable })}
        type="button"
        onClick={() => (clickable ? handleClick(workflowData.query || {}) : null)}
      >
        <span>{workflowData.count || 0}</span> {i18n.t("cases.label")}
      </button>
    </div>
  );
};

WorkFlowStep.displayName = NAME;

WorkFlowStep.propTypes = {
  casesWorkflow: PropTypes.object,
  css: PropTypes.object,
  i18n: PropTypes.object,
  step: PropTypes.object.isRequired
};

export default WorkFlowStep;
