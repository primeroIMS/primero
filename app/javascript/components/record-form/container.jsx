import React, { useEffect, memo, useState } from "react";
import PropTypes from "prop-types";
import { useMediaQuery } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { withRouter } from "react-router-dom";
import clsx from "clsx";

import { useThemeHelper } from "../../libs";
import { useI18n } from "../i18n";
import { PageContainer } from "../page";
import { Transitions, fetchTransitions } from "../transitions";
import { LoadingIndicator } from "../loading-indicator";
import { fetchRecord, saveRecord, selectRecord } from "../records";
import {
  APPROVALS,
  RECORD_TYPES,
  REFERRAL,
  RECORD_OWNER,
  TRANSITION_TYPE
} from "../../config";
import RecordOwner from "../record-owner";
import { Approvals } from "../approvals";

import { NAME } from "./constants";
import { Nav } from "./nav";
import { RecordForm, RecordFormToolbar } from "./form";
import styles from "./styles.css";
import {
  getFirstTab,
  getFormNav,
  getRecordForms,
  getLoadingState,
  getErrors,
  getSelectedForm
} from "./selectors";
import { compactValues } from "./helpers";

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

  const record = useSelector(state =>
    selectRecord(state, containerMode, params.recordType, params.id)
  );

  const selectedModule = {
    recordType,
    primeroModule: record ? record.get("module_id") : params.module
  };

  const formNav = useSelector(state => getFormNav(state, selectedModule));
  const forms = useSelector(state => getRecordForms(state, selectedModule));
  const firstTab = useSelector(state => getFirstTab(state, selectedModule));
  const loading = useSelector(state => getLoadingState(state));
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
      const body = {
        data: {
          ...compactValues(values, initialValues),
          ...(!containerMode.isEdit
            ? { module_id: selectedModule.primeroModule }
            : {})
        }
      };
      const message = containerMode.isEdit
        ? i18n.t(`${recordType}.messages.update_success`, {
            record_id: record.get("short_id")
          })
        : i18n.t(`${recordType}.messages.creation_success`, recordType);
      const redirect = containerMode.isNew
        ? `/${params.recordType}`
        : `/${params.recordType}/${params.id}`;

      dispatch(
        saveRecord(
          params.recordType,
          saveMethod,
          body,
          params.id,
          message,
          redirect
        )
      );
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
    recordType: params.recordType
  };

  const toolbarProps = {
    mode: containerMode,
    params,
    recordType,
    handleFormSubmit,
    shortId: record ? record.get("short_id") : null,
    primeroModule: selectedModule.primeroModule,
    record
  };

  const navProps = {
    formNav,
    selectedForm,
    firstTab,
    handleToggleNav,
    mobileDisplay,
    selectedRecord: record ? record.get("id") : null
  };

  useEffect(() => {
    if (params.id && (containerMode.isShow || containerMode.isEdit)) {
      dispatch(fetchRecord(params.recordType, params.id));
    }
  }, [
    containerMode.isEdit,
    containerMode.isShow,
    dispatch,
    params.id,
    params.recordType
  ]);

  useEffect(() => {
    dispatch(fetchTransitions(params.recordType, params.id));
  }, [params.recordType, params.id]);

  // TODO: When transfer_request be implement change the transition_ype
  const isRecordOwnerForm = RECORD_OWNER === selectedForm;
  const isApprovalsForm = APPROVALS === selectedForm;
  const isTransitions = TRANSITION_TYPE.includes(selectedForm);
  const transitionProps = {
    isReferral: REFERRAL === selectedForm,
    recordType: params.recordType,
    record: params.id
  };

  const approvalSubforms = record?.get("approval_subforms");

  let renderForm;

  if (isRecordOwnerForm) {
    renderForm = <RecordOwner record={record} recordType={params.recordType} />;
  } else if (isApprovalsForm) {
    renderForm = <Approvals approvals={approvalSubforms} />;
  } else if (isTransitions) {
    renderForm = <Transitions {...transitionProps} />;
  } else {
    renderForm = <RecordForm {...formProps} />;
  }

  return (
    <PageContainer twoCol>
      <LoadingIndicator
        hasData={!!(forms && formNav && firstTab)}
        type={params.recordType}
        loading={loading}
        errors={errors}
      >
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
            {renderForm}
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
