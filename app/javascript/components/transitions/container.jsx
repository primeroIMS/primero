import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { compareDesc } from "date-fns";

import { useI18n } from "../i18n";
import RecordFormTitle from "../record-form/form/record-form-title";

import { selectTransitions } from "./selectors";
import { TRANSITIONS_NAME } from "./constants";
import renderTransition from "./render-transition";
import styles from "./styles.css";

const Transitions = ({ isReferral, recordType, record, showMode, mobileDisplay, handleToggleNav }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  const dataTransitions = useSelector(state => selectTransitions(state, recordType, record, isReferral));
  const renderDataTransitions =
    dataTransitions &&
    dataTransitions
      .sort((transitionA, transitionB) => compareDesc(transitionA.created_at, transitionB.created_at))
      .map(transition => renderTransition(transition, css, recordType, showMode));

  const transitionTitle = isReferral ? i18n.t("forms.record_types.referrals") : i18n.t("transfer_assignment.title");

  return (
    <div>
      <RecordFormTitle mobileDisplay={mobileDisplay} handleToggleNav={handleToggleNav} displayText={transitionTitle} />
      <div>{renderDataTransitions}</div>
    </div>
  );
};

Transitions.displayName = TRANSITIONS_NAME;

Transitions.propTypes = {
  handleToggleNav: PropTypes.func.isRequired,
  isReferral: PropTypes.bool.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  record: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired,
  showMode: PropTypes.bool
};

export default Transitions;
