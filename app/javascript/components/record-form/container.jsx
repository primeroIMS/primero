import React, { useEffect, memo, useState } from "react";
import PropTypes from "prop-types";
import { useMediaQuery } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { withRouter } from "react-router-dom";
import { useI18n } from "components/i18n";
import { PageContainer } from "components/page-container";
import { LoadingIndicator } from "components/loading-indicator";
import { useThemeHelper } from "libs";
import clsx from "clsx";
import { Nav } from "./nav";
import NAMESPACE from "./namespace";
import { RecordForm, RecordFormToolbar } from "./form";
import styles from "./styles.css";
import { fetchRecord, saveRecord } from "./action-creators";
import {
  getFirstTab,
  getFormNav,
  getRecordForms,
  getRecord,
  getLoadingState,
  getErrors
} from "./selectors";
import { RECORD_TYPES } from "./constants";
import { compactValues } from "./helpers";

const RecordForms = ({ match, mode }) => {
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
  // eslint-disable-next-line no-param-reassign
  const { params } = match;
  const recordType = RECORD_TYPES[params.recordType];

  const record = useSelector(state => getRecord(state, containerMode));

  const selectedModule = {
    recordType,
    primeroModule: record ? record.get("module_id") : params.module
  };

  const formNav = useSelector(state => getFormNav(state, selectedModule));
  const forms = useSelector(state => getRecordForms(state, selectedModule));
  const firstTab = useSelector(state => getFirstTab(state, selectedModule));
  const loading = useSelector(state => getLoadingState(state));
  const errors = useSelector(state => getErrors(state));
  const selectedForm = useSelector(state =>
    state.getIn([NAMESPACE, "selectedForm"])
  );

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
    onSubmit: (initialValues, values, setSubmitting) => {
      dispatch(
        saveRecord(
          params.recordType,
          containerMode.isEdit ? "update" : "save",
          {
            data: {
              ...compactValues(values, initialValues),
              module_id: selectedModule.primeroModule
            }
          },
          params.id,
          containerMode.isEdit
            ? i18n.t(`${recordType}.messages.update_success`, {
                record_id: record.get("short_id")
              })
            : i18n.t(`${recordType}.messages.creation_success`, recordType)
        )
      );
      setSubmitting(false);
    },
    bindSubmitForm: boundSubmitForm => {
      submitForm = boundSubmitForm;
    },
    handleToggleNav,
    mobileDisplay,
    selectedForm,
    forms,
    mode: containerMode,
    record
  };

  const toolbarProps = {
    mode: containerMode,
    params,
    recordType,
    handleFormSubmit,
    shortId: record ? record.get("short_id") : null
  };

  const navProps = {
    formNav,
    selectedForm,
    firstTab,
    handleToggleNav,
    mobileDisplay
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
          <div className={css.recordForms}>
            <RecordForm {...formProps} />
          </div>
        </div>
      </LoadingIndicator>
    </PageContainer>
  );
};

RecordForms.propTypes = {
  match: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired
};

export default memo(withRouter(RecordForms));
