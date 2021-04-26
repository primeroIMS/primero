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

  const workflowData = casesWorkflow.getIn(["indicators", "workflow", step.id], fromJS({}));
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
  const handleClickButton = () => (clickable ? handleClick(query) : null);

  return (
    <div className={css.stepCases} icon={null}>
      <button className={classes} type="button" onClick={handleClickButton}>
        <span>{count}</span> {i18n.t("cases.label")}
      </button>
    </div>
  );
};

WorkFlowStep.displayName = NAME;

WorkFlowStep.defaultProps = {
  casesWorkflow: fromJS({}),
  step: {}
};

WorkFlowStep.propTypes = {
  casesWorkflow: PropTypes.object,
  css: PropTypes.object,
  i18n: PropTypes.object,
  step: PropTypes.object
};

export default WorkFlowStep;
