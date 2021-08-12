import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/styles/makeStyles";
import { fromJS } from "immutable";
import { isEmpty } from "lodash";

import { useI18n } from "../../../i18n";
import LoadingIndicator from "../../../loading-indicator";
import SubformDrawer from "../../../record-form/form/subforms/subform-drawer";
import { clearMatchedTraces, getShortIdFromUniqueId } from "../../../records";
import { RECORD_PATH } from "../../../../config";
import TraceComparisonForm from "../../../record-form/form/subforms/subform-traces/components/trace-comparison-form";

import { MatchedTracePanel } from "./components";
import { NAME } from "./constants";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Component = ({ data, loading, record, setSelectedForm }) => {
  const i18n = useI18n();
  const css = useStyles();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [selectedTraceId, setSelectedTraceId] = useState("");

  const foundMatchedTrace = data.find(matched => matched.get("id") === selectedTraceId, null, fromJS({}));

  useEffect(() => {
    return () => {
      dispatch(clearMatchedTraces());
    };
  }, []);

  if (isEmpty(record)) {
    return null;
  }

  const selectedTrace = fromJS({
    case: {
      age: record.get("age"),
      case_id_display: record.get("case_id_display"),
      id: record.get("id"),
      name: record.get("name"),
      owned_by: record.get("owned_by"),
      owned_by_agency_id: record.get("owned_by_agency_id"),
      sex: record.get("sex")
    },
    // eslint-disable-next-line camelcase
    comparison: foundMatchedTrace?.get("matched_case_comparison"),
    trace: foundMatchedTrace,
    likelihood: "possible",
    score: 0.4136639493462357
  });

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

  const handleClose = () => setOpen(false);

  return (
    <div className={css.matchedTracesContainer}>
      <h3>{i18n.t("tracing_request.matches")}</h3>
      <LoadingIndicator loading={loading} hasData={data.size > 0} type={NAME}>
        {renderMatchedTraces}
      </LoadingIndicator>
      <SubformDrawer
        title={i18n.t("cases.summary.matched_trace", { trace_id: getShortIdFromUniqueId(selectedTraceId) })}
        open={open}
        cancelHandler={handleClose}
      >
        <TraceComparisonForm
          selectedForm="matched-trace-detail"
          recordType={RECORD_PATH.cases}
          potentialMatch={selectedTrace}
          setSelectedForm={setSelectedForm}
          hideBack
        />
      </SubformDrawer>
    </div>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  data: fromJS([])
};

Component.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
  record: PropTypes.object,
  setSelectedForm: PropTypes.func
};

export default Component;
