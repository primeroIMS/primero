import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { List, ListItemText } from "@material-ui/core";
import { fromJS } from "immutable";

import SubformDrawer from "../../../record-form/form/subforms/subform-drawer";
import { fetchCasesPotentialMatches, getCasesPotentialMatches } from "../../../records";
import { RECORD_PATH } from "../../../../config";
import LoadingIndicator from "../../../loading-indicator";
import IndexTable from "../../../index-table";

import { NAME } from "./constants";
import { columns } from "./utils";

const Component = ({ cancelHandler, css, open, title, record, i18n, mode }) => {
  const dispatch = useDispatch();
  const potentialMatches = useSelector(state => getCasesPotentialMatches(state));
  const loading = potentialMatches.get("loading", false);
  const data = potentialMatches.get("data", []);

  useEffect(() => {
    if (open && !mode.isNew) {
      dispatch(fetchCasesPotentialMatches(record.get("id"), RECORD_PATH.cases));
    }
  }, [open]);

  if (!record) {
    return null;
  }

  const tableOptions = {
    columns: columns(i18n, css),
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
    <SubformDrawer title={title} open={open} cancelHandler={cancelHandler}>
      <LoadingIndicator loading={loading} hasData={!isEmpty(data)} type={NAME}>
        <List>
          <ListItemText primary={i18n.t("forms.record_types.case")} className={css.listTitle} />
          <ListItemText primary={`${i18n.t("tracing_requests.id")}: #${record?.get("case_id_display")}`} />
        </List>
        <IndexTable {...tableOptions} />
      </LoadingIndicator>
    </SubformDrawer>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  cancelHandler: PropTypes.func,
  css: PropTypes.object,
  i18n: PropTypes.object,
  mode: PropTypes.object,
  open: PropTypes.bool,
  record: PropTypes.object,
  title: PropTypes.string
};

export default Component;
