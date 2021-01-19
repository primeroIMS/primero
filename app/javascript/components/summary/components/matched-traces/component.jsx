import React from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import makeStyles from "@material-ui/styles/makeStyles";

import { useI18n } from "../../../i18n";

import { MatchedTracePanel } from "./components";
import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ data }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  const renderMatchedTraces = isEmpty(data) ? (
    <p className={css.nothingFound}>{i18n.t("tracing_request.messages.nothing_found")}</p>
  ) : (
    data.map(matchedTrace => <MatchedTracePanel key={matchedTrace.id} css={css} matchedTrace={matchedTrace} />)
  );

  return (
    <div className={css.matchedTracesContainer}>
      <h3>{i18n.t("tracing_request.matches")}</h3>
      {renderMatchedTraces}
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  data: PropTypes.array
};

export default Component;
