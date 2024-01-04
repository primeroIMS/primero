import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { useCallback, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import qs from "qs";
import { fromJS } from "immutable";
import { push, replace } from "connected-react-router";
import omit from "lodash/omit";
import { useI18n } from "../../i18n";
import merge from "deepmerge";
import buildSelectedIds from "../utils/build-selected-ids";
import { useMemoizedSelector, dataToJS } from "../../../libs";
import { getMetadata } from "../../record-list/selectors";
import { getRecordsData, getRecords } from "../../index-table";
import { linkIncidentToCase, setCaseIdForIncident, setSelectedRecord } from "../../records";
import { Search } from "../../index-filters/components/filter-types";
import { DEFAULT_FILTERS } from "../../record-list/constants";
import { NAME } from "./constants";
import IndexTable from "../../index-table";
import { clearDialog } from "../../action-dialog/action-creators";
import { fetchCasePotentialMatches, fetchLinkIncidentToCaseData, setSelectedPotentialMatch } from "../../records";
import SubformDrawer from "../../record-form/form/subforms/subform-drawer";
import ActionButton from "../../action-button";
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";
import { ACTION_BUTTON_TYPES } from "../../action-button/constants";
import { usePermissions, ACTIONS } from "../../../components/permissions";
import { useApp } from "../../application";
import ViewModal from "../../../components/record-list/view-modal";
import css from "./styles.css";
import { Grid } from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import isEmpty from "lodash/isEmpty";

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
  const caseData = useMemoizedSelector(state => getRecords(state, recordTypeValue).get("data"));
  const [openViewModal, setOpenViewModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [showTablel, setShowTablel] = useState(true);
  const [caseInfo, setCaseInfo] = useState();

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
        name: "id",
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
        name: "case_id_display", options: {
          customBodyRender: (value, tableMeta) => {
            const { rowData } = tableMeta;
            return (
              <ActionButton
                id="case.case_id_display-button"
                text={value}
                type={ACTION_BUTTON_TYPES.default}
                variant="text"
                color="primary"
                noTranslate
                onClick={() => 
                 handleRowClick(rowData[1], rowData[3])
                }
              />
            );
          }
        }

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
      selectableRows: "none",
      onCellClick: false,
      elevation: 0,
      pagination: true,
    },

  };

  const onClose = () => {
    dispatch(fetchLinkIncidentToCaseData({}))
    close();
  };

  // const handleSelectedRecords = (index) => {
  //   if (index[0].length === 1) {
  //     setSelectedRecords(index);
  //     const { id, case_id_display } = fetchIdFromPosition(index);
  //     setSelectedCaseId(id);
  //     setSelectedCaseDisplayId(case_id_display)
  //     setDelayStateUpdate(false);
  //   } else {
  //     setSelectedRecords(index);
  //     setDelayStateUpdate(true);
  //   }
  // };

  // const fetchIdFromPosition = (index) => {
  //   if (dataToJS(caseData) && dataToJS(caseData).length > index[0][0]) {
  //     const object = dataToJS(caseData)[index[0][0]];
  //     return { id: object.id, case_id_display: object.case_id_display };
  //   }
  //   return null;
  // };

  const onBack = () => {
    setShowTablel(true);
    setCaseInfo(undefined);
  };

  const handleRowClick =(selectedId, selectedDisplayId)=> {
      setShowTablel(false);
      const caseDetail = [];
      const caseDataInJs = dataToJS(caseData)
      caseDataInJs.map((value) => {
        if (value.id === selectedId) {
          caseDetail.push(value);
          return caseDetail;
        }
      })
      setCaseInfo(caseDetail); 
      setSelectedCaseId(selectedId);
      setSelectedCaseDisplayId(selectedDisplayId);
    }
  return (
    <>
      <SubformDrawer title={i18n.t("incident.link_incident_to_case")} open={open} cancelHandler={onClose} >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)} data-testid="search-form-for-link-to-case">
            <Search />
          </form>
        </FormProvider>
        {showTablel ?
          <IndexTable
            {...tableOptions}
            selectedRecords={selectedRows}
            //setSelectedRecords={(event) => { handleSelectedRecords(event) }}
          />
          : (!showTablel && caseInfo !== undefined ?
            <Grid container spacing={4}>
              <ActionButton
              id="back-button"
              icon={<ArrowBackIosIcon />}
              text="buttons.back"
              type={ACTION_BUTTON_TYPES.default}
              rest={{
                onClick: onBack,
              }}
            />
              <ActionButton
                id={css.caseIdDetailLink}              
                icon={<CheckIcon />}
                text="buttons.link"
                type={ACTION_BUTTON_TYPES.default}
                rest={{
                  onClick: handleOk,
                }}
              />
              <Grid container item>
                <Grid item xs={8}>
                  <h2>
                    {i18n.t("case.label")} <span className={css.recordId}>{caseInfo[0].case_id_display}</span>
                  </h2>
                </Grid>
              </Grid>

              <Grid container item className={css.fieldRow}>
                <Grid item xs={2}>
                  <span className={css.fieldTitle}>{"Name"}</span>
                </Grid>
                <Grid item xs={4}>
                  {caseInfo[0].name}
                </Grid>
              </Grid>
              <Grid container item className={css.fieldRow}>
                <Grid item xs={2}>
                  <span className={css.fieldTitle}>{"Age"}</span>
                </Grid>
                <Grid item xs={4}>
                  {caseInfo[0].age}
                </Grid>
              </Grid>
              <Grid container item className={css.fieldRow}>
                <Grid item xs={2}>
                  <span className={css.fieldTitle}>{"Sex"}</span>
                </Grid>
                <Grid item xs={4}>
                  {caseInfo[0].sex}
                </Grid>
              </Grid>
              <Grid container item className={css.fieldRow} spacing={4}>
                <Grid item xs={6}>
                  <h2>{i18n.t("tracing_request.case_photos")}</h2>
                  {isEmpty(caseInfo[0].photos) ? (
                    <span className={css.nothingFound}>{i18n.t("tracing_request.messages.nothing_found")}</span>
                  ) : (
                    <PhotoArray isGallery images={caseInfo[0].photos} />
                  )}
                </Grid>
              </Grid>
            </Grid>
            :
            null)
        }       
      </SubformDrawer>

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


