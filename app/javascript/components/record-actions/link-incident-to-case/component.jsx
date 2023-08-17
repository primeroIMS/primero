import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { useCallback, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import qs from "qs";
import { fromJS } from "immutable";
import omit from "lodash/omit";
import { useI18n } from "../../i18n";
import merge from "deepmerge";
import ActionDialog from "../../action-dialog";
import buildSelectedIds from "../utils/build-selected-ids";
import { useMemoizedSelector, dataToJS } from "../../../libs";
import { getMetadata } from "../../record-list/selectors";
import { getRecordsData, getRecords } from "../../index-table";
import { linkIncidentToCase, setCaseIdForIncident } from "../../records";
import { Search } from "../../index-filters/components/filter-types";
import { DEFAULT_FILTERS } from "../../record-list/constants";
import { NAME } from "./constants";
import IndexTable from "../../index-table";
import { clearDialog } from "../../action-dialog/action-creators";
import { fetchCasePotentialMatches, fetchLinkIncidentToCaseData } from "../../records";

const Component = ({ close, open, currentPage, selectedRecords, clearSelectedRecords, recordType }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = qs.parse(location.search.replace("?", ""));
  const recordss = useMemoizedSelector(state => getRecordsData(state, recordType));
  const metadata = useMemoizedSelector(state => getMetadata(state, recordType));
  const defaultFilters = fromJS(Object.keys(queryParams).length ? queryParams : DEFAULT_FILTERS).merge(metadata);
  const selectedIds = buildSelectedIds(selectedRecords, recordss, currentPage, "id");
  const incident_ids = selectedIds.length ? selectedIds : location.pathname.split("/")[2];
  const { ...methods } = useForm();
  const [selectedRows, setSelectedRecords] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState();
  const [selectedCaseDisplayId, setSelectedCaseDisplayId] = useState();
  const [delayStateUpdate, setDelayStateUpdate] = useState(true);
  const [recordTypeValue, setRecordTypeValue] = useState();
  const caseData = useMemoizedSelector(state => getRecords(state, "cases").get("data"));

  useEffect(() => {
    if (delayStateUpdate) {
      const timeoutId = setTimeout(() => {
        setSelectedCaseId(null); // Update selected case ID after a delay
      }, 0);

      return () => {
        clearTimeout(timeoutId); // Clear the timeout if the component unmounts before it triggers
      };
    }
  }, [delayStateUpdate]);

  const handleOk = () => {
    dispatch(linkIncidentToCase({ recordType, incident_ids: incident_ids, case_id: selectedCaseId }));
    dispatch(fetchLinkIncidentToCaseData({}));
    dispatch(setCaseIdForIncident(selectedCaseId, selectedCaseDisplayId));
    dispatch(clearDialog());
  };

  const handleSubmit = useCallback(data => {
    setRecordTypeValue('cases');
    dispatch(fetchLinkIncidentToCaseData(data));
  }, []);

  const tableOptions = {
    columns: [
      {
        name: "case.id",
        options: {
          display: false
        }
      },
      {
        label: i18n.t("potential_match.name"),
        name: "name"
      },
      {
        label: i18n.t("potential_match.case_id"),
        name: "case_id_display"
      },
      {
        label: i18n.t("potential_match.child_age"),
        name: "age"
      },
      {
        label: i18n.t("potential_match.child_gender"),
        name: "sex"
      }
    ],
    defaultFilters: fromJS({}),
    recordType: recordTypeValue,
    targetRecordType: recordTypeValue,
    bypassInitialFetch: true,
    options: {
      selectableRows: "multiple",
      selectableRowsHeader: false,
      selectToolbarPlacement: "none",
      onCellClick: false,
      elevation: 0,
      pagination: true
    }
  };

  const onClose = () => {
    dispatch(fetchLinkIncidentToCaseData({}))
    close();
  };

  const handleSelectedRecords = (index) => {
    if (index[0].length === 1) {
      setSelectedRecords(index);
      const {id, case_id_display} = fetchIdFromPosition(index);
      setSelectedCaseId(id);
      setSelectedCaseDisplayId(case_id_display)
      setDelayStateUpdate(false);
    } else {
      setSelectedRecords(index);
      setDelayStateUpdate(true);
    }
  };

  const fetchIdFromPosition = (index) => {
    if (dataToJS(caseData) && dataToJS(caseData).length > index[0][0]) {
      const object = dataToJS(caseData)[index[0][0]];
      return {id: object.id, case_id_display: object.case_id_display};
    }
    return null;
  };

  return (
    <>
      <ActionDialog
        open={open}
        successHandler={handleOk}
        cancelHandler={onClose}
        onClose={onClose}
        dialogTitle={i18n.t("incident.link_incident_to_case")}
        dialogText={""}
        confirmButtonLabel={"Link"}
        enabledSuccessButton={selectedCaseId !== undefined && selectedCaseId !== null ? true : false}
        omitCloseAfterSuccess>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <Search />
          </form>
        </FormProvider>
        <IndexTable {...tableOptions} selectedRecords={selectedRows} setSelectedRecords={(event) => { handleSelectedRecords(event) }} />
      </ActionDialog>
    </>
  );
};

Component.defaultProps = {
  defaultFilters: fromJS({})
};

Component.displayName = NAME;

Component.propTypes = {
  clearSelectedRecords: PropTypes.func,
  close: PropTypes.func,
  currentPage: PropTypes.number,
  open: PropTypes.bool,
  recordType: PropTypes.string,
  selectedRecords: PropTypes.object,
  defaultFilters: PropTypes.object
};

export default Component;