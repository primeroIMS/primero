// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useMediaQuery } from "@mui/material";
import { batch, useDispatch } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { cx } from "@emotion/css";
import { fromJS } from "immutable";

import FormFilters from "../../../form-filters";
import { useMemoizedSelector } from "../../../../libs";
import { useI18n } from "../../../i18n";
import PageContainer from "../../../page";
import LoadingIndicator from "../../../loading-indicator";
import { clearSelectedRecord, fetchRecord, saveRecord, setSelectedRecord } from "../../../records";
import { RECORD_TYPES, RECORD_TYPES_PLURAL, REFERRAL, RECORD_PATH } from "../../../../config";
import { getIsProcessingSomeAttachment, getLoadingRecordState } from "../../../records/selectors";
import { clearRecordAttachments, fetchRecordsAlerts } from "../../../records/action-creators";
import useIncidentFromCase from "../../../records/use-incident-form-case";
import SaveAndRedirectDialog from "../../../save-and-redirect-dialog";
import { fetchReferralUsers } from "../../../record-actions/transitions/action-creators";
import { getLoadingState, getErrors, getSelectedForm, getIsServicesForm } from "../../selectors";
import { clearDataProtectionInitialValues, clearValidationErrors, setPreviousRecord } from "../../action-creators";
import Nav from "../../nav";
import { RecordForm, RecordFormToolbar } from "../../form";
import css from "../../styles.css";
import { compactBlank, compactReadOnlyFields, compactValues, getRedirectPath } from "../../utils";
import externalForms from "../external-forms";

function Component({
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
}) {
  let submitForm = null;
  const mobileDisplay = useMediaQuery(theme => theme.breakpoints.down("sm"));

  const { state: locationState } = useLocation();
  const history = useHistory();

  const dispatch = useDispatch();
  const i18n = useI18n();

  const selectedModule = {
    recordType,
    primeroModule: record ? record.get("module_id") : params.module,
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
  const isServicesForm = useMemoizedSelector(state =>
    getIsServicesForm(state, { recordType, primeroModule: selectedModule.primeroModule, formName: selectedForm })
  );

  const handleFormSubmit = e => {
    if (submitForm) {
      submitForm(e);
    }
  };

  const [toggleNav, setToggleNav] = useState(false);
  const [formikValuesForNav, setFormikValuesForNav] = useState({});

  const handleToggleNav = useCallback(() => {
    setToggleNav(!toggleNav);
  }, [toggleNav]);

  const formProps = {
    onSubmit: useCallback(
      (initialValues, values) => {
        const saveMethod = containerMode.isEdit ? "update" : "save";
        const { incidentPath, ...formValues } = values;

        const writableValues = compactReadOnlyFields(formValues, forms);

        const body = {
          data: {
            ...(containerMode.isEdit ? compactValues(writableValues, initialValues) : compactBlank(writableValues)),
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
          // TODO: Remove this condition once alerts get implemented for registry_records
          if (params.recordType !== RECORD_TYPES_PLURAL.registry_record) {
            dispatch(fetchRecordsAlerts(params.recordType, params.id), params);
          }
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
    if (isNotANewCase && canRefer && isServicesForm) {
      dispatch(
        fetchReferralUsers({
          record_type: RECORD_TYPES[params.recordType],
          record_module_id: selectedModule.primeroModule
        })
      );
    }
  }, [isServicesForm]);

  const isNotANewIncident = !containerMode.isNew && params.recordType === RECORD_PATH.incidents;

  const transitionProps = {
    fetchable: isNotANewCase || isNotANewIncident,
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

  const handleFormikValues = useCallback(values => setFormikValuesForNav(values), []);

  const canSeeForm = !loadingForm && forms.size === 0 ? canViewCases : forms.size > 0 && !formNav.isEmpty() && firstTab;
  const hasData = Boolean(canSeeForm && (containerMode.isNew || record) && (containerMode.isNew || isCaseIdEqualParam));
  const loading = Boolean(loadingForm || loadingRecord);
  const renderRecordFormToolbar = selectedModule.primeroModule && <RecordFormToolbar {...toolbarProps} />;

  const containerClasses = cx(css.recordContainer, {
    [css.formNavOpen]: toggleNav && mobileDisplay
  });
  const navContainerClasses = cx(css.recordNav, { [css.demo]: demo });
  const demoClasses = cx({ [css.demo]: demo });

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
    transitionProps
  });

  const navSelectedRecords = record ? record.get("id") : null;
  const hasForms = !loadingForm && forms.size > 0;

  return (
    <PageContainer twoCol>
      <LoadingIndicator hasData={hasData} type={params.recordType} loading={loading} errors={errors}>
        {renderRecordFormToolbar}
        <div className={containerClasses}>
          <div className={navContainerClasses}>
            <Nav
              firstTab={firstTab}
              formNav={formNav}
              handleToggleNav={handleToggleNav}
              isNew={containerMode.isNew}
              isShow={containerMode.isShow}
              mobileDisplay={mobileDisplay}
              recordType={params.recordType}
              selectedForm={selectedForm}
              selectedRecord={navSelectedRecords}
              toggleNav={toggleNav}
              primeroModule={selectedModule.primeroModule}
              hasForms={hasForms}
              recordId={params.id}
              formikValuesForNav={formikValuesForNav}
            />
          </div>
          <div className={`${css.recordForms} ${demoClasses} record-form-container`}>
            <RecordForm
              {...formProps}
              externalForms={recordFormExternalForms}
              externalComponents={externalComponents}
              selectedForm={selectedForm}
              attachmentForms={attachmentForms}
              userPermittedFormsIds={userPermittedFormsIds}
              setFormikValuesForNav={handleFormikValues}
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
}

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
