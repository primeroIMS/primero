import React, { useEffect, memo, useState } from "react";
import PropTypes from "prop-types";
import { useMediaQuery } from "@material-ui/core";
import { batch, useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import clsx from "clsx";

import { useThemeHelper } from "../../libs";
import { useI18n } from "../i18n";
import PageContainer from "../page";
import Transitions, { fetchTransitions } from "../transitions";
import { fetchReferralUsers } from "../record-actions/transitions/action-creators";
import LoadingIndicator from "../loading-indicator";
import {
  clearSelectedRecord,
  fetchRecord,
  getIncidentFromCase,
  saveRecord,
  selectRecord,
  setSelectedRecord,
  getCaseIdForIncident,
  fetchIncidentwitCaseId
} from "../records";
import {
  APPROVALS,
  RECORD_TYPES,
  RECORD_OWNER,
  TRANSITION_TYPE,
  RECORD_PATH,
  REFERRAL,
  INCIDENT_FROM_CASE
} from "../../config";
import { REFER_FROM_SERVICE } from "../../libs/permissions";
import RecordOwner from "../record-owner";
import Approvals from "../approvals";
import IncidentFromCase from "../incidents-from-case";
import { getLoadingRecordState } from "../records/selectors";
import { usePermissions } from "../user";
import { fetchRecordsAlerts } from "../records/action-creators";
import { getPermittedFormsIds } from "../user/selectors";

import { clearValidationErrors } from "./action-creators";
import { NAME } from "./constants";
import Nav from "./nav";
import { RecordForm, RecordFormToolbar } from "./form";
import styles from "./styles.css";
import { getFirstTab, getFormNav, getRecordForms, getLoadingState, getErrors, getSelectedForm } from "./selectors";
import { compactValues, getRedirectPath } from "./utils";

const Container = ({ match, mode }) => {
  let submitForm = null;
  const { theme } = useThemeHelper(styles);
  const mobileDisplay = useMediaQuery(theme.breakpoints.down("sm"));

  const containerMode = {
    isNew: mode === "new",
    isEdit: mode === "edit",
    isShow: mode === "show"
  };

  const css = makeStyles(styles)();
  const dispatch = useDispatch();
  const i18n = useI18n();
  const { params } = match;
  const recordType = RECORD_TYPES[params.recordType];

  const incidentFromCase = useSelector(state => getIncidentFromCase(state, recordType));
  const fetchFromCaseId = useSelector(state => getCaseIdForIncident(state, recordType));

  const record = useSelector(state => selectRecord(state, containerMode, params.recordType, params.id));

  const userPermittedFormsIds = useSelector(state => getPermittedFormsIds(state));

  const selectedModule = {
    recordType,
    primeroModule: record ? record.get("module_id") : params.module,
    formsIds: userPermittedFormsIds
  };

  const formNav = useSelector(state => getFormNav(state, selectedModule));
  const forms = useSelector(state => getRecordForms(state, selectedModule));
  const firstTab = useSelector(state => getFirstTab(state, selectedModule));
  const loadingForm = useSelector(state => getLoadingState(state));
  const loadingRecord = useSelector(state => getLoadingRecordState(state, params.recordType));
  const errors = useSelector(state => getErrors(state));
  const selectedForm = useSelector(state => getSelectedForm(state));

  const handleFormSubmit = e => {
    if (submitForm) {
      submitForm(e);
    }
  };

  const [toggleNav, setToggleNav] = useState(false);

  const handleToggleNav = () => {
    setToggleNav(!toggleNav);
  };

  const formProps = {
    onSubmit: (initialValues, values) => {
      const saveMethod = containerMode.isEdit ? "update" : "save";
      const { incidentPath } = values;

      if (incidentPath) {
        // eslint-disable-next-line no-param-reassign
        delete values.incidentPath;
      }
      const body = {
        data: {
          ...compactValues(values, initialValues),
          ...(!containerMode.isEdit ? { module_id: selectedModule.primeroModule } : {})
        }
      };
      const message = () => {
        return containerMode.isEdit
          ? i18n.t(`${recordType}.messages.update_success`, {
              record_id: record.get("short_id")
            })
          : i18n.t(`${recordType}.messages.creation_success`, recordType);
      };

      batch(async () => {
        await dispatch(
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
            Boolean(incidentFromCase?.size),
            selectedModule.primeroModule,
            incidentPath,
            i18n.t("offline_submitted_changes")
          )
        );
      });
      // TODO: Set this if there are any errors on validations
      // setSubmitting(false);
    },
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
    primeroModule: selectedModule.primeroModule
  };

  useEffect(() => {
    if (params.id) {
      batch(() => {
        dispatch(setSelectedRecord(params.recordType, params.id));
        dispatch(fetchRecord(params.recordType, params.id));
        dispatch(fetchRecordsAlerts(params.recordType, params.id));
      });
    }
  }, [params.id, params.recordType]);

  const canRefer = usePermissions(params.recordType, REFER_FROM_SERVICE);

  useEffect(() => {
    if (!containerMode.isNew && params.recordType === RECORD_PATH.cases) {
      batch(() => {
        dispatch(fetchTransitions(params.recordType, params.id));

        if (canRefer) {
          dispatch(
            fetchReferralUsers({
              record_type: RECORD_TYPES[params.recordType]
            })
          );
        }
      });
    }
  }, [params.recordType, params.id]);

  useEffect(() => {
    return () => {
      batch(() => {
        dispatch(clearSelectedRecord(params.recordType));
        dispatch(clearValidationErrors());
      });
    };
  }, []);

  useEffect(() => {
    if (fetchFromCaseId && RECORD_TYPES[params.recordType] === RECORD_TYPES.incidents) {
      dispatch(fetchIncidentwitCaseId(fetchFromCaseId, selectedModule.primeroModule));
    }
  }, [fetchFromCaseId]);

  const transitionProps = {
    isReferral: REFERRAL === selectedForm,
    recordType: params.recordType,
    record: params.id,
    showMode: containerMode.isShow,
    mobileDisplay,
    handleToggleNav
  };

  const approvalSubforms = record?.get("approval_subforms");
  const incidentsSubforms = record?.get("incident_details");

  const externalForms = (form, setFieldValue, handleSubmit) => {
    const isTransitions = TRANSITION_TYPE.includes(form);

    const externalFormSelected = isTransitions ? TRANSITION_TYPE : form;

    return {
      [RECORD_OWNER]: (
        <RecordOwner
          record={record}
          recordType={params.recordType}
          mobileDisplay={mobileDisplay}
          handleToggleNav={handleToggleNav}
        />
      ),
      [APPROVALS]: (
        <Approvals approvals={approvalSubforms} mobileDisplay={mobileDisplay} handleToggleNav={handleToggleNav} />
      ),
      [INCIDENT_FROM_CASE]: (
        <IncidentFromCase
          record={record}
          incidents={incidentsSubforms}
          mobileDisplay={mobileDisplay}
          handleToggleNav={handleToggleNav}
          mode={containerMode}
          setFieldValue={setFieldValue}
          handleSubmit={handleSubmit}
          recordType={params.recordType}
        />
      ),
      [TRANSITION_TYPE]: <Transitions {...transitionProps} />
    }[externalFormSelected];
  };

  const hasData = Boolean(forms && formNav && firstTab && (containerMode.isNew || record));
  const loading = Boolean(loadingForm || loadingRecord);

  return (
    <PageContainer twoCol>
      <LoadingIndicator hasData={hasData} type={params.recordType} loading={loading} errors={errors}>
        <RecordFormToolbar {...toolbarProps} />
        <div
          className={clsx(css.recordContainer, {
            [css.formNavOpen]: toggleNav && mobileDisplay
          })}
        >
          <div className={css.recordNav}>
            <Nav {...navProps} />
          </div>
          <div className={`${css.recordForms} record-form-container`}>
            <RecordForm {...formProps} externalForms={externalForms} selectedForm={selectedForm} />
          </div>
        </div>
      </LoadingIndicator>
    </PageContainer>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  match: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired
};

export default memo(withRouter(Container));
