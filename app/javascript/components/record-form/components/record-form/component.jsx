import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useMediaQuery } from "@material-ui/core";
import { batch, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation, useHistory } from "react-router-dom";
import clsx from "clsx";
import { fromJS } from "immutable";

import FormFilters from "../../../form-filters";
import { useMemoizedSelector } from "../../../../libs";
import { useI18n } from "../../../i18n";
import PageContainer from "../../../page";
import LoadingIndicator from "../../../loading-indicator";
import { clearSelectedRecord, fetchRecord, saveRecord, setSelectedRecord } from "../../../records";
import { RECORD_TYPES, REFERRAL } from "../../../../config";
import { getIsProcessingSomeAttachment, getLoadingRecordState } from "../../../records/selectors";
import { clearRecordAttachments, fetchRecordsAlerts } from "../../../records/action-creators";
import useIncidentFromCase from "../../../records/use-incident-form-case";
import SaveAndRedirectDialog from "../../../save-and-redirect-dialog";
import { fetchReferralUsers } from "../../../record-actions/transitions/action-creators";
import { SERVICES_SUBFORM } from "../../../record-actions/add-service/constants";
import { getLoadingState, getErrors, getSelectedForm } from "../../selectors";
import { clearDataProtectionInitialValues, clearValidationErrors, setPreviousRecord } from "../../action-creators";
import Nav from "../../nav";
import { RecordForm, RecordFormToolbar } from "../../form";
import styles from "../../styles.css";
import { compactBlank, compactValues, getRedirectPath } from "../../utils";
import externalForms from "../external-forms";

const useStyles = makeStyles(styles);

const Component = ({
  approvalSubforms,
  attachmentForms,
  canRefer,
  canSeeChangeLog,
  canViewCases,
  canViewSummaryForm,
  containerMode,
  demo,
  fetchFromCaseId,
  firstTab,
  formNav,
  forms,
  incidentFromCase,
  incidentsSubforms,
  isCaseIdEqualParam,
  isNotANewCase,
  mode,
  params,
  record,
  recordAttachments,
  recordType,
  shouldFetchRecord,
  summaryForm,
  userPermittedFormsIds
}) => {
  let submitForm = null;
  const mobileDisplay = useMediaQuery(theme => theme.breakpoints.down("sm"));

  const { state: locationState } = useLocation();
  const history = useHistory();
  const css = useStyles();
  const dispatch = useDispatch();
  const i18n = useI18n();

  const selectedModule = {
    recordType,
    primeroModule: record ? record.get("module_id") : params.module,
    checkPermittedForms: true,
    renderCustomForms: canViewSummaryForm
  };

  const {
    handleCreateIncident,
    redirectDialogOpen,
    closeRedirectDialog,
    setSaveCaseBeforeRedirect,
    setCaseIncidentData,
    saveBeforeIncidentRedirect,
    dialogParams
  } = useIncidentFromCase({
    record,
    mode: containerMode
  });

  const loadingForm = useMemoizedSelector(state => getLoadingState(state));
  const loadingRecord = useMemoizedSelector(state => getLoadingRecordState(state, params.recordType));
  const errors = useMemoizedSelector(state => getErrors(state));
  const selectedForm = useMemoizedSelector(state => getSelectedForm(state));
  const isProcessingSomeAttachment = useMemoizedSelector(state =>
    getIsProcessingSomeAttachment(state, params.recordType)
  );

  const handleFormSubmit = e => {
    if (submitForm) {
      submitForm(e);
    }
  };

  const [toggleNav, setToggleNav] = useState(false);

  const handleToggleNav = useCallback(() => {
    setToggleNav(!toggleNav);
  }, []);

  const formProps = {
    onSubmit: useCallback(
      (initialValues, values) => {
        const saveMethod = containerMode.isEdit ? "update" : "save";
        const { incidentPath, ...formValues } = values;

        const body = {
          data: {
            ...(containerMode.isEdit ? compactValues(formValues, initialValues) : compactBlank(formValues)),
            ...(!containerMode.isEdit ? { module_id: selectedModule.primeroModule } : {}),
            ...(fetchFromCaseId ? { incident_case_id: fetchFromCaseId } : {})
          }
        };
        const message = () => {
          return containerMode.isEdit
            ? i18n.t(`${recordType}.messages.update_success`, {
                record_id: record.get("short_id")
              })
            : i18n.t(`${recordType}.messages.creation_success`, recordType);
        };

        batch(() => {
          if (saveBeforeIncidentRedirect) {
            setCaseIncidentData(formValues, incidentPath, true);
          }

          if (containerMode.isNew) {
            dispatch(clearDataProtectionInitialValues());
          }

          dispatch(
            saveRecord(
              params.recordType,
              saveMethod,
              body,
              params.id,
              message(),
              i18n.t("offline_submitted_changes"),
              getRedirectPath(containerMode, params, fetchFromCaseId),
              true,
              "",
              saveBeforeIncidentRedirect,
              selectedModule.primeroModule,
              incidentPath,
              i18n.t("offline_submitted_changes")
            )
          );
        });
        // TODO: Set this if there are any errors on validations
        // setSubmitting(false);
      },
      [saveBeforeIncidentRedirect]
    ),
    bindSubmitForm: boundSubmitForm => {
      submitForm = boundSubmitForm;
    },
    handleToggleNav,
    mobileDisplay,
    selectedForm,
    forms,
    mode: containerMode,
    record,
    incidentFromCase,
    fetchFromCaseId,
    recordType: params.recordType,
    primeroModule: selectedModule.primeroModule
  };

  const toolbarProps = {
    mode: containerMode,
    params,
    recordType,
    handleFormSubmit,
    caseIdDisplay: record ? record.get("case_id_display") : null,
    shortId: record ? record.get("short_id") : null,
    primeroModule: selectedModule.primeroModule,
    record
  };

  const navProps = {
    firstTab,
    formNav,
    handleToggleNav,
    isNew: containerMode.isNew,
    mobileDisplay,
    recordType: params.recordType,
    selectedForm,
    selectedRecord: record ? record.get("id") : null,
    toggleNav,
    primeroModule: selectedModule.primeroModule,
    hasForms: !loadingForm && forms.size > 0
  };

  useEffect(() => {
    if (params.id && !loadingRecord && recordAttachments.size && !isProcessingSomeAttachment) {
      dispatch(clearRecordAttachments(params.id, params.recordType));
    }
  }, [loadingRecord, isProcessingSomeAttachment, recordAttachments.size]);

  useEffect(() => {
    return () => {
      dispatch(setPreviousRecord(fromJS({ id: params.id, recordType: params.recordType })));
    };
  }, []);

  useEffect(() => {
    batch(() => {
      if (params.id) {
        dispatch(setSelectedRecord(params.recordType, params.id));

        if (!locationState?.preventSyncAfterRedirect && shouldFetchRecord) {
          dispatch(fetchRecord(params.recordType, params.id));
          dispatch(fetchRecordsAlerts(params.recordType, params.id));
          dispatch(setPreviousRecord(fromJS({ id: params.id, recordType: params.recordType })));
        }
      }
    });

    history.replace(history.location.pathname, {});
  }, [params.id, params.recordType, shouldFetchRecord]);

  useEffect(() => {
    return () => {
      batch(() => {
        dispatch(clearSelectedRecord(params.recordType));
        dispatch(clearValidationErrors());

        if (params.id) {
          dispatch(clearRecordAttachments(params.id, params.recordType));
        }
      });
    };
  }, []);

  useEffect(() => {
    if (isNotANewCase && canRefer && selectedForm === SERVICES_SUBFORM) {
      dispatch(
        fetchReferralUsers({
          record_type: RECORD_TYPES[params.recordType],
          record_module_id: selectedModule.primeroModule
        })
      );
    }
  }, [selectedForm]);

  const transitionProps = {
    fetchable: isNotANewCase,
    isReferral: REFERRAL === selectedForm,
    recordType: params.recordType,
    recordID: params.id,
    showMode: containerMode.isShow,
    mobileDisplay,
    handleToggleNav
  };

  // eslint-disable-next-line react/display-name, react/no-multi-comp, react/prop-types
  const externalComponents = useCallback(
    ({ setFieldValue, values }) => {
      return (
        <SaveAndRedirectDialog
          open={redirectDialogOpen}
          closeRedirectDialog={closeRedirectDialog}
          setFieldValue={setFieldValue}
          handleSubmit={handleFormSubmit}
          values={values}
          mode={containerMode}
          recordType={recordType}
          setSaveCaseBeforeRedirect={setSaveCaseBeforeRedirect}
          incidentPath={dialogParams?.get("path")}
        />
      );
    },
    [dialogParams, redirectDialogOpen, containerMode, recordType]
  );

  const canSeeForm = !loadingForm && forms.size === 0 ? canViewCases : forms.size > 0 && formNav && firstTab;
  const hasData = Boolean(canSeeForm && (containerMode.isNew || record) && (containerMode.isNew || isCaseIdEqualParam));
  const loading = Boolean(loadingForm || loadingRecord);
  const renderRecordFormToolbar = selectedModule.primeroModule && <RecordFormToolbar {...toolbarProps} />;

  const containerClasses = clsx(css.recordContainer, {
    [css.formNavOpen]: toggleNav && mobileDisplay
  });
  const navContainerClasses = clsx(css.recordNav, { [css.demo]: demo });
  const demoClasses = clsx({ [css.demo]: demo });

  const recordFormExternalForms = externalForms({
    approvalSubforms,
    canSeeChangeLog,
    containerMode,
    handleCreateIncident,
    handleToggleNav,
    id: params.id,
    incidentsSubforms,
    mobileDisplay,
    primeroModule: selectedModule.primeroModule,
    record,
    recordType,
    selectedForm,
    summaryForm,
    transitionProps,
    userPermittedFormsIds
  });

  return (
    <PageContainer twoCol>
      <LoadingIndicator hasData={hasData} type={params.recordType} loading={loading} errors={errors}>
        {renderRecordFormToolbar}
        <div className={containerClasses}>
          <div className={navContainerClasses}>
            <Nav {...navProps} />
          </div>
          <div className={`${css.recordForms} ${demoClasses} record-form-container`}>
            <RecordForm
              {...formProps}
              externalForms={recordFormExternalForms}
              externalComponents={externalComponents}
              selectedForm={selectedForm}
              attachmentForms={attachmentForms}
              userPermittedFormsIds={userPermittedFormsIds}
            />
            <FormFilters
              selectedForm={selectedForm}
              recordType={selectedModule.recordType}
              primeroModule={selectedModule.primeroModule}
              formMode={mode}
              showDrawer
            />
          </div>
        </div>
      </LoadingIndicator>
    </PageContainer>
  );
};

Component.displayName = "RecordForm";

Component.propTypes = {
  approvalSubforms: PropTypes.object,
  attachmentForms: PropTypes.object,
  canRefer: PropTypes.bool,
  canSeeChangeLog: PropTypes.bool,
  canViewCases: PropTypes.bool,
  canViewSummaryForm: PropTypes.bool,
  containerMode: PropTypes.object,
  demo: PropTypes.bool,
  fetchFromCaseId: PropTypes.bool,
  firstTab: PropTypes.object,
  formNav: PropTypes.object,
  forms: PropTypes.object,
  incidentFromCase: PropTypes.object,
  incidentsSubforms: PropTypes.object,
  isCaseIdEqualParam: PropTypes.bool,
  isNotANewCase: PropTypes.bool,
  mode: PropTypes.string,
  params: PropTypes.object,
  record: PropTypes.object,
  recordAttachments: PropTypes.object,
  recordType: PropTypes.string,
  shouldFetchRecord: PropTypes.bool,
  summaryForm: PropTypes.object,
  userPermittedFormsIds: PropTypes.object
};

export default Component;
