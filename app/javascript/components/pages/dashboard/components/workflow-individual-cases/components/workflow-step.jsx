import PropTypes from "prop-types";
import clsx from "clsx";
import isEmpty from "lodash/isEmpty";
import { push } from "connected-react-router";
import { useDispatch } from "react-redux";
import { fromJS } from "immutable";

import { ROUTES } from "../../../../../../config";
import { buildFilter } from "../../../../../dashboard/utils";

import { NAME } from "./constants";

const WorkFlowStep = ({ step, casesWorkflow, css, i18n }) => {
  const dispatch = useDispatch();
  const getData = workflowStep =>
    casesWorkflow.size > 0 && casesWorkflow.getIn(["indicators", "workflow", workflowStep], fromJS({}));

  const workflowData = getData(step.id);
  const count = workflowData.get("count", 0);
  const query = workflowData.get("query", fromJS({}));

  const handleClick = filter => {
    dispatch(
      push({
        pathname: ROUTES.cases,
        search: buildFilter(filter)
      })
    );
  };

  const clickable = !isEmpty(workflowData) && count > 0;
  const classes = clsx(css.itemButton, { [css.itemButtonClick]: clickable });

  return (
    <div className={css.stepCases} icon={null}>
      <button className={classes} type="button" onClick={() => (clickable ? handleClick(query) : null)}>
        <span>{count}</span> {i18n.t("cases.label")}
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