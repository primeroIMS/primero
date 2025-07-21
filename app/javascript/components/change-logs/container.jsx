// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import useMemoizedSelector from "../../libs/use-memoized-selector";
import { OPTION_TYPES } from "../form/constants";
import { useI18n } from "../i18n";
import { getFields } from "../record-form";
import RecordFormTitle from "../record-form/form/record-form-title";
import { getOptions as getLookups } from "../record-form/selectors";
import { useFormFilters } from "../form-filters";
import useOptions from "../form/use-options";
import LoadMoreRecord from "../load-more-records";

import { fetchChangeLogs } from "./action-creators";
import ChangeLog from "./components/change-log";
import SubformDialog from "./components/subform-dialog";
import { NAME, FIRST_PAGE_RESULTS } from "./constants";
import { getChangeLogs, getChangeLogLoading, getChangeLogMetadata } from "./selectors";
import css from "./styles.css";

function Container({ selectedForm, recordID, recordType, mobileDisplay, handleToggleNav, fetchable = false }) {
  const i18n = useI18n();

  const dispatch = useDispatch();
  const { clearFilters } = useFormFilters(selectedForm);

  const [open, setOpen] = useState(false);
  const [calculatingChangeLog, setCalculatingChangeLog] = useState(false);
  const [recordChanges, setRecordChanges] = useState({});

  const recordChangeLogs = useMemoizedSelector(state => getChangeLogs(state, recordID, recordType));
  const changeLogLoading = useMemoizedSelector(state => getChangeLogLoading(state));
  const changeLogMetadata = useMemoizedSelector(state => getChangeLogMetadata(state));

  const allFields = useMemoizedSelector(state => getFields(state));
  const allAgencies = useOptions({ source: OPTION_TYPES.AGENCY, useUniqueId: true });
  const allLookups = useMemoizedSelector(state => getLookups(state));
  const locations = useOptions({ source: OPTION_TYPES.LOCATION });

  useEffect(() => {
    clearFilters();
  }, []);

  useEffect(() => {
    if (fetchable && recordID) {
      dispatch(fetchChangeLogs(recordType, recordID, FIRST_PAGE_RESULTS));
    }
  }, [recordID]);

  const sharedProps = {
    allAgencies,
    allFields,
    allLookups,
    locations,
    setOpen,
    setCalculatingChangeLog
  };

  return (
    <div className={css.container} data-testid="change-logs">
      <RecordFormTitle
        mobileDisplay={mobileDisplay}
        handleToggleNav={handleToggleNav}
        displayText={i18n.t("change_logs.label")}
      />
      <ChangeLog {...sharedProps} recordChangeLogs={recordChangeLogs} setRecordChanges={setRecordChanges} />

      <LoadMoreRecord
        selectedForm={selectedForm}
        recordID={recordID}
        recordType={recordType}
        loading={changeLogLoading}
        metadata={changeLogMetadata}
        fetchFn={fetchChangeLogs}
        fetchable={fetchable}
      />
      <SubformDialog
        {...sharedProps}
        open={open}
        calculatingChangeLog={calculatingChangeLog}
        recordChanges={recordChanges}
      />
    </div>
  );
}

Container.displayName = NAME;

Container.propTypes = {
  fetchable: PropTypes.bool,
  forms: PropTypes.object,
  handleToggleNav: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  recordID: PropTypes.string,
  recordType: PropTypes.string.isRequired,
  selectedForm: PropTypes.string
};

export default Container;
