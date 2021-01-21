import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/styles/makeStyles";
import { fromJS } from "immutable";

import { useI18n } from "../../../i18n";
import LoadingIndicator from "../../../loading-indicator";
import SubformDrawer from "../../../record-form/form/subforms/subform-drawer";
import {
  fetchCasesPotentialMatches,
  getCasesPotentialMatches,
  getLoadingCasesPotentialMatches,
  clearMatchedTraces
} from "../../../records";
import { RECORD_PATH } from "../../../../config";
import TraceComparisonForm from "../../../record-form/form/subforms/subform-traces/components/trace-comparison-form";

import { MatchedTracePanel } from "./components";
import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ data, loading, recordId }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedTraceId, setSelectedTraceId] = useState("");
  const potentialMatches = useSelector(state => getCasesPotentialMatches(state));
  const potentialMatchesLoading = useSelector(state => getLoadingCasesPotentialMatches(state));
  const selectedTrace =
    potentialMatches.size > 0
      ? potentialMatches.find(potentialMatch => potentialMatch.getIn(["trace", "id"]) === selectedTraceId)
      : fromJS({});

  useEffect(() => {
    if (selectedTraceId !== "" && potentialMatches.size <= 0) {
      dispatch(fetchCasesPotentialMatches(recordId, RECORD_PATH.cases));
    }
  }, [selectedTraceId]);

  useEffect(() => {
    return () => {
      dispatch(clearMatchedTraces());
    };
  }, []);

  const renderMatchedTraces =
    data.size > 0 &&
    data.map(matchedTrace => (
      <MatchedTracePanel
        key={matchedTrace.get("id")}
        css={css}
        matchedTrace={matchedTrace}
        setOpen={setOpen}
        setSelectedTraceId={setSelectedTraceId}
      />
    ));

  return (
    <div className={css.matchedTracesContainer}>
      <h3>{i18n.t("tracing_request.matches")}</h3>
      <LoadingIndicator loading={loading} hasData={data.size > 0} type={NAME}>
        {renderMatchedTraces}
      </LoadingIndicator>
      <SubformDrawer title={i18n.t("cases.summary.find_match")} open={open} cancelHandler={() => setOpen(false)}>
        <LoadingIndicator loading={potentialMatchesLoading} hasData={selectedTrace?.size > 0} type={NAME}>
          <TraceComparisonForm
            selectedForm="matched-trace-detail"
            recordType={RECORD_PATH.cases}
            potentialMatch={selectedTrace}
          />
        </LoadingIndicator>
      </SubformDrawer>
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
  recordId: PropTypes.string
};

export default Component;
