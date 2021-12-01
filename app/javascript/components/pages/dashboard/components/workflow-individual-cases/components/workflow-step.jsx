import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { push } from "connected-react-router";
import { useDispatch } from "react-redux";
import { fromJS } from "immutable";

import { ROUTES } from "../../../../../../config";
import { buildFilter } from "../../../../../dashboard/utils";
import { DashboardChip } from "../../../../../dashboard";
import { displayNameHelper } from "../../../../../../libs";

import { NAME } from "./constants";

const WorkFlowStep = ({ step, casesWorkflow, i18n }) => {
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
  const handleClickButton = () => (clickable ? handleClick(query) : null);

  const chipText = `${count} ${displayNameHelper(step.display_text, i18n.locale) || ""}`;
  const chipType = count === 0 ? "defaultNoCount" : "default";

  return <DashboardChip label={chipText} handleClick={handleClickButton} type={chipType} />;
};

WorkFlowStep.displayName = NAME;

WorkFlowStep.defaultProps = {
  casesWorkflow: fromJS({}),
  step: {}
};

WorkFlowStep.propTypes = {
  casesWorkflow: PropTypes.object,
  i18n: PropTypes.object,
  step: PropTypes.object
};

export default WorkFlowStep;
