import React from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/styles/makeStyles";

import { useI18n } from "../../../i18n";
import LoadingIndicator from "../../../loading-indicator";

import { MatchedTracePanel } from "./components";
import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ data, loading }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  const renderMatchedTraces =
    data.size >= 0 &&
    data.map(matchedTrace => <MatchedTracePanel key={matchedTrace.get("id")} css={css} matchedTrace={matchedTrace} />);

  return (
    <div className={css.matchedTracesContainer}>
      <h3>{i18n.t("tracing_request.matches")}</h3>
      <LoadingIndicator loading={loading} hasData={data.size >= 0} type={NAME}>
        {renderMatchedTraces}
      </LoadingIndicator>
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool
};

export default Component;
