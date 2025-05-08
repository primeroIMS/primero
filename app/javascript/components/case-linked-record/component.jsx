// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import AddIcon from "@mui/icons-material/Add";

import SubformDrawer from "../record-form/form/subforms/subform-drawer";
import { useI18n } from "../i18n";
import useMemoizedSelector from "../../libs/use-memoized-selector";
import { getRecordFieldsByName, getRecordFormsByUniqueId } from "../record-form/selectors";
import { CASE, RECORD_TYPES_PLURAL } from "../../config";
import ActionButton, { ACTION_BUTTON_TYPES } from "../action-button";
import SubformEmptyData from "../record-form/form/subforms/subform-empty-data";
import { enqueueSnackbar } from "../notifier";
import { fetchRecord, selectRecord } from "../records";
import { useApp } from "../application";
import RecordFormTitle from "../record-form/form/record-form-title";
import css from "../record-form/form/subforms/styles.css";

import RecordHeader from "./components/record-header";
import SearchForm from "./components/search-form";
import Results from "./components/results";
import ResultDetails from "./components/result-details";

function Component({
  caseFormUniqueId,
  formId,
  handleToggleNav,
  headerFieldNames,
  isPermitted,
  linkedRecordType,
  linkedRecordFormUniqueId,
  linkFieldDisplay,
  linkField,
  mobileDisplay,
  mode,
  permissions,
  phoneticFieldNames = [],
  primeroModule,
  recordType,
  searchFieldNames,
  setFieldValue,
  showAddNew,
  showHeader,
  showSelectButton,
  validatedFieldNames = [],
  values
}) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { online } = useApp();

  const [component, setComponent] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const [drawerTitle, setDrawerTitle] = useState("");

  const fieldValue = values[linkField];

  const record = useMemoizedSelector(state =>
    selectRecord(state, { isEditOrShow: true, recordType: RECORD_TYPES_PLURAL[linkedRecordType], id: fieldValue })
  );

  const caseLinkedForm = useMemoizedSelector(state =>
    getRecordFormsByUniqueId(state, {
      checkVisible: false,
      formName: caseFormUniqueId,
      primeroModule,
      recordType: CASE,
      getFirst: true
    })
  );

  const title = caseLinkedForm.getIn(["name", i18n.locale], null);
  const formName = caseLinkedForm.i18nName ? i18n.t(title) : title;

  const fields = useMemoizedSelector(state =>
    getRecordFieldsByName(state, {
      name: searchFieldNames,
      recordType: linkedRecordType,
      primeroModule,
      omitDuplicates: true,
      checkPermittedForms: false,
      checkVisible: false
    })
  );

  const handleCancel = () => {
    setDrawerOpen(false);
  };

  const handleAddNew = () => {
    setDrawerOpen(true);
  };

  const handleOpenMatch = async () => {
    await setComponent(2);
    setDrawerOpen(true);
  };

  const redirectIfNotAllowed = useCallback(() => {
    if (!isPermitted) {
      handleCancel();
      dispatch(enqueueSnackbar("", { messageKey: "error_page.not_authorized.title", type: "error" }));
    }
  }, [isPermitted]);

  const handleSetSearchParams = useCallback(
    params => {
      setSearchParams(params);
    },
    [searchParams]
  );

  const handleSetComponent = useCallback(
    index => {
      setComponent(index);
    },
    [component]
  );

  const handleSetDrawerTitle = useCallback(
    (key, options = {}, translate = true) => {
      setDrawerTitle(translate ? i18n.t(`${recordType}.${key}`, options) : key);
    },
    [drawerTitle]
  );

  useEffect(() => {
    if (!drawerOpen) {
      setComponent(!online ? 1 : 0);
    }
  }, [drawerOpen]);

  useEffect(() => {
    if (record.isEmpty() && fieldValue && online) {
      dispatch(fetchRecord(RECORD_TYPES_PLURAL[linkedRecordType], fieldValue));
    }
  }, [fieldValue, online, record.isEmpty()]);

  const RenderComponents = {
    0: SearchForm,
    1: Results,
    2: ResultDetails
  }[component];

  const subformTitle = mode.isEdit ? i18n.t("fields.add_field_type", { file_type: formName }) : formName;

  return (
    <>
      <RecordFormTitle mobileDisplay={mobileDisplay} handleToggleNav={handleToggleNav} displayText={formName} />
      <div className={css.subformFieldArrayContainer}>
        <div>
          <h3 className={css.subformTitle}>{subformTitle}</h3>
        </div>
        {showAddNew && !fieldValue && !mode.isShow && (
          <div>
            <ActionButton
              type={ACTION_BUTTON_TYPES.default}
              text="case.add_new"
              rest={{ onClick: handleAddNew }}
              icon={<AddIcon />}
            />
          </div>
        )}
      </div>
      {showHeader &&
        (fieldValue ? (
          <RecordHeader
            record={record}
            values={values}
            fieldNames={headerFieldNames}
            linkedRecordType={linkedRecordType}
            handleOpenMatch={handleOpenMatch}
          />
        ) : (
          <SubformEmptyData subformName={formName} single />
        ))}

      <SubformDrawer open={drawerOpen} cancelHandler={handleCancel} title={drawerTitle}>
        {drawerOpen && (
          <RenderComponents
            id={fieldValue}
            formId={formId}
            setSearchParams={handleSetSearchParams}
            setComponent={handleSetComponent}
            setDrawerTitle={handleSetDrawerTitle}
            handleCancel={handleCancel}
            fields={fields}
            searchParams={searchParams}
            recordType={recordType}
            linkedRecordType={linkedRecordType}
            primeroModule={primeroModule}
            mode={mode}
            locale={i18n.locale}
            permissions={permissions}
            redirectIfNotAllowed={redirectIfNotAllowed}
            setFieldValue={setFieldValue}
            showSelectButton={showSelectButton}
            formName={formName}
            noForm={caseLinkedForm.i18nName}
            online={online}
            caseFormUniqueId={caseFormUniqueId}
            linkedRecordFormUniqueId={linkedRecordFormUniqueId}
            searchFieldNames={searchFieldNames}
            validatedFieldNames={validatedFieldNames}
            linkField={linkField}
            linkFieldDisplay={linkFieldDisplay}
            phoneticFieldNames={phoneticFieldNames}
          />
        )}
      </SubformDrawer>
    </>
  );
}

Component.displayName = "CaseLinkedRecord";

Component.propTypes = {
  caseFormUniqueId: PropTypes.string.isRequired,
  formId: PropTypes.string.isRequired,
  handleToggleNav: PropTypes.func.isRequired,
  headerFieldNames: PropTypes.array.isRequired,
  isPermitted: PropTypes.bool.isRequired,
  linkedRecordFormUniqueId: PropTypes.string.isRequired,
  linkedRecordType: PropTypes.string.isRequired,
  linkField: PropTypes.string.isRequired,
  linkFieldDisplay: PropTypes.string.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  mode: PropTypes.object.isRequired,
  permissions: PropTypes.object.isRequired,
  phoneticFieldNames: PropTypes.array.isRequired,
  primeroModule: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired,
  searchFieldNames: PropTypes.array.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  showAddNew: PropTypes.bool.isRequired,
  showHeader: PropTypes.bool.isRequired,
  showSelectButton: PropTypes.bool.isRequired,
  validatedFieldNames: PropTypes.array.isRequired,
  values: PropTypes.object.isRequired
};

export default Component;
