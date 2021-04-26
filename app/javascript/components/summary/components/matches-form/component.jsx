import { useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { List, ListItemText } from "@material-ui/core";
import { fromJS } from "immutable";

import {
  fetchCasesPotentialMatches,
  getCasesPotentialMatches,
  getLoadingCasesPotentialMatches,
  setSelectedCasePotentialMatch
} from "../../../records";
import { RECORD_PATH } from "../../../../config";
import LoadingIndicator from "../../../loading-indicator";
import IndexTable from "../../../index-table";
import { FORMS } from "../../../record-form/form/subforms/subform-traces/constants";
import { useMemoizedSelector } from "../../../../libs";

import { NAME } from "./constants";
import { columns } from "./utils";

const Component = ({ css, i18n, mode, open, record, setSelectedForm, matchedTracesData }) => {
  const dispatch = useDispatch();

  const data = useMemoizedSelector(state => getCasesPotentialMatches(state));
  const loading = useMemoizedSelector(state => getLoadingCasesPotentialMatches(state));

  const matchedTracesIds = matchedTracesData.map(matchedTrace => matchedTrace.get("id"));

  useEffect(() => {
    if (open && !mode.isNew) {
      dispatch(fetchCasesPotentialMatches(record.get("id"), RECORD_PATH.cases));
    }
  }, [open]);

  const onTracingRequestClick = value => {
    dispatch(setSelectedCasePotentialMatch(value, RECORD_PATH.cases));
    setSelectedForm(FORMS.comparison);
  };

  if (!record) {
    return null;
  }

  const tableOptions = {
    columns: columns(i18n, css, onTracingRequestClick, matchedTracesIds),
    defaultFilters: fromJS({}),
    onTableChange: () => fetchCasesPotentialMatches(record.get("id"), RECORD_PATH.cases),
    recordType: [RECORD_PATH.cases, "potentialMatches"],
    targetRecordType: RECORD_PATH.cases,
    bypassInitialFetch: true,
    options: {
      selectableRows: "none",
      onCellClick: false,
      elevation: 0,
      pagination: false
    }
  };

  return (
    <LoadingIndicator loading={loading} hasData={!isEmpty(data)} type={NAME}>
      <List>
        <ListItemText primary={i18n.t("forms.record_types.case")} className={css.listTitle} />
        <ListItemText primary={`${i18n.t("tracing_requests.id")}: #${record.get("case_id_display")}`} />
      </List>
      <IndexTable {...tableOptions} />
    </LoadingIndicator>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  css: PropTypes.object,
  i18n: PropTypes.object,
  matchedTracesData: PropTypes.object,
  mode: PropTypes.object,
  open: PropTypes.bool,
  record: PropTypes.object,
  setSelectedForm: PropTypes.func
};

export default Component;
