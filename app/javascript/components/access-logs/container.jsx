// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import useMemoizedSelector from "../../libs/use-memoized-selector";
import { useI18n } from "../i18n";
import RecordFormTitle from "../record-form/form/record-form-title";
import LoadMoreRecord from "../load-more-records";
import { FILTER_NAMES } from "../form-filters/components/access-log/constants";
import { defaultDateValues } from "../form-filters/components/access-log/utils";

import { fetchAccessLogs, fetchUsersWhoAccessed } from "./action-creators";
import AccessLog from "./components/access-log";
import { NAME, FIRST_PAGE_RESULTS } from "./constants";
import { getAccessLogs, getAccessLogLoading, getAccessLogMetadata } from "./selectors";
import css from "./styles.css";

function Container({ selectedForm, recordID, recordType, mobileDisplay, handleToggleNav, fetchable = true }) {
  const i18n = useI18n();

  const dispatch = useDispatch();

  const recordAccessLogs = useMemoizedSelector(state => getAccessLogs(state, recordID, recordType));
  const accessLogLoading = useMemoizedSelector(state => getAccessLogLoading(state));
  const accessLogMetadata = useMemoizedSelector(state => getAccessLogMetadata(state));
  const initialFilters = {
    [FILTER_NAMES.timestamp]: defaultDateValues()
  };

  useEffect(() => {
    if (fetchable && recordID) {
      dispatch(fetchAccessLogs(recordType, recordID, FIRST_PAGE_RESULTS, initialFilters));
      dispatch(fetchUsersWhoAccessed(recordType, recordID));
    }
  }, [recordID]);

  return (
    <div className={css.container} data-testid="access-logs">
      <RecordFormTitle
        mobileDisplay={mobileDisplay}
        handleToggleNav={handleToggleNav}
        displayText={i18n.t("access_log.label")}
      />
      <AccessLog recordAccessLogs={recordAccessLogs} />
      <LoadMoreRecord
        selectedForm={selectedForm}
        recordID={recordID}
        recordType={recordType}
        loading={accessLogLoading}
        metadata={accessLogMetadata}
        fetchFn={fetchAccessLogs}
        fetchable={fetchable}
      />
    </div>
  );
}

Container.displayName = NAME;

Container.propTypes = {
  fetchable: PropTypes.bool,
  handleToggleNav: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  recordID: PropTypes.string,
  recordType: PropTypes.string.isRequired,
  selectedForm: PropTypes.string
};

export default Container;
