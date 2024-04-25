import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { useCallback, useState } from "react";
import { fromJS } from "immutable";

import { useI18n } from "../../i18n";
import buildSelectedIds from "../utils/build-selected-ids";
import { useMemoizedSelector } from "../../../libs";
import { getRecordsData, getRecords } from "../../index-table";
import { linkIncidentToCase, setCaseIdForIncident, fetchLinkIncidentToCaseData } from "../../records";
import { Search } from "../../index-filters/components/filter-types";
import { clearDialog } from "../../action-dialog/action-creators";
import SubformDrawer from "../../record-form/form/subforms/subform-drawer";
import { RECORD_TYPES_PLURAL } from "../../../config";

import { NAME } from "./constants";
import css from "./styles.css";
import Content from "./content";

const Component = ({ close, open, currentPage, selectedRecords, recordType, record }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { ...methods } = useForm();

  const [selectedCaseId, setSelectedCaseId] = useState();
  const [selectedCaseDisplayId, setSelectedCaseDisplayId] = useState();
  const [recordTypeValue, setRecordTypeValue] = useState();
  const [showTable, setShowTable] = useState(true);
  const [caseInfo, setCaseInfo] = useState(fromJS({}));

  const records = useMemoizedSelector(state => getRecordsData(state, recordType));
  const caseData = useMemoizedSelector(state => getRecords(state, recordTypeValue));

  const selectedIDs = buildSelectedIds(selectedRecords, records, currentPage, "id");

  const handleOk = useCallback(() => {
    dispatch(
      linkIncidentToCase({
        recordType,
        selectedIDs: record ? [record.get("id")] : selectedIDs,
        caseID: selectedCaseId
      })
    );

    dispatch(setCaseIdForIncident(selectedCaseId, selectedCaseDisplayId));
    dispatch(clearDialog());
  }, [selectedCaseId, selectedCaseDisplayId, recordType, record, selectedIDs]);

  const handleSubmit = useCallback(data => {
    setRecordTypeValue(RECORD_TYPES_PLURAL.case);
    dispatch(fetchLinkIncidentToCaseData(data));
  }, []);

  const handleRowClick = useCallback(
    async (selectedID, selectedDisplayID) => {
      await setShowTable(false);
      await setCaseInfo(caseData.get("data").find($record => $record.get("id") === selectedID));
      await setSelectedCaseId(selectedID);
      setSelectedCaseDisplayId(selectedDisplayID);
    },
    [caseData]
  );

  const handleClose = () => {
    dispatch(fetchLinkIncidentToCaseData({}));
    close();
  };

  const handleBack = useCallback(async () => {
    await setShowTable(true);
    setCaseInfo(fromJS({}));
  }, []);

  return (
    <>
      <SubformDrawer title={i18n.t("incident.link_incident_to_case")} open={open} cancelHandler={handleClose}>
        <div className={css.form}>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)} data-testid="search-form-for-link-to-case">
              <Search />
            </form>
          </FormProvider>
        </div>
        <Content
          showTable={showTable}
          caseInfo={caseInfo}
          handleBack={handleBack}
          handleOk={handleOk}
          handleRowClick={handleRowClick}
          recordTypeValue={recordTypeValue}
        />
      </SubformDrawer>
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  clearSelectedRecords: PropTypes.func,
  close: PropTypes.func,
  currentPage: PropTypes.number,
  defaultFilters: PropTypes.object,
  open: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string,
  selectedRecords: PropTypes.object
};

export default Component;
