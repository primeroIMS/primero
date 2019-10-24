import React from "react";
import { useSelector } from "react-redux";
import { useI18n } from "components/i18n";
import makeStyles from "@material-ui/styles/makeStyles";
import {
  ExpansionPanelDetails,
  ExpansionPanelSummary
} from "@material-ui/core";
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ArrowIcon from "@material-ui/icons/KeyboardArrowRight";
import PropTypes from "prop-types";
import styles from "./styles.css";
import { selectTransitions } from "./selectors";
import AssignmentsSummary from "./assignments/AssignmentsSummary";
import AssignmentsDetails from "./assignments/AssignmentsDetails";
import TransferSummary from "./transfers/TransferSummary";
import TransferDetails from "./transfers/TransferDetails";
import TransitionPanel from "./TransitionPanel";

const Transitions = ({ recordType, record }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  const dataTransitions = useSelector(state =>
    selectTransitions(state, recordType, record)
  );
  const renderSummary = transition => {
    switch (transition.type) {
      case "Assign":
        return <AssignmentsSummary transition={transition} classes={css} />;
      case "Transfer":
        return <TransferSummary transition={transition} classes={css} />;
      default:
        return <h2>Not Found</h2>;
    }
  };

  const renderDetails = transition => {
    switch (transition.type) {
      case "Assign":
        return <AssignmentsDetails transition={transition} classes={css} />;
      case "Transfer":
        return <TransferDetails transition={transition} classes={css} />;
      default:
        return <h2>Not Found</h2>;
    }
  };

  const renderTransition = transition => {
    return (
      <div key={transition.id}>
        <TransitionPanel key={transition.id} name={transition.id}>
          <ExpansionPanelSummary
            expandIcon={<ArrowIcon />}
            aria-controls="filter-controls-content"
            id={transition.id}
          >
            {renderSummary(transition)}
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {renderDetails(transition)}
          </ExpansionPanelDetails>
        </TransitionPanel>
      </div>
    );
  };

  const renderDataTransitions =
    dataTransitions &&
    dataTransitions.map(transition => renderTransition(transition));

  return (
    <div>
      <div className={css.formTitle}>
        <h1 className={css.pageTitle}>{i18n.t("transfer_assignment.title")}</h1>
      </div>
      {renderDataTransitions}
    </div>
  );
};

Transitions.propTypes = {
  recordType: PropTypes.string.isRequired,
  record: PropTypes.string.isRequired
};

export default Transitions;
