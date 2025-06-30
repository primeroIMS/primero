// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import AddIcon from "@mui/icons-material/Add";

import SubformDrawer from "../record-form/form/subforms/subform-drawer";
import { useI18n } from "../i18n";
import { ConditionalWrapper, useMemoizedSelector } from "../../libs";
import DisableOffline from "../disable-offline";
import { getRecordFieldsByName, getRecordFormsByUniqueId } from "../record-form/selectors";
import { CASE } from "../../config";
import ActionButton, { ACTION_BUTTON_TYPES } from "../action-button";
import { enqueueSnackbar } from "../notifier";
import { useApp } from "../application";
import RecordFormTitle from "../record-form/form/record-form-title";
import css from "../record-form/form/subforms/styles.css";

import RecordHeader from "./components/record-header";
import SearchPanel from "./components/search-panel";
import SearchForm from "./components/search-form";
import Results from "./components/results";
import ResultDetails from "./components/result-details";

function Component({
  addNewProps = {},
  caseFormUniqueId,
  columns,
  disableOffline = {},
  drawerTitles,
  formId,
  handleToggleNav,
  headerFieldNames,
  idField = "id",
  isPermitted,
  isRecordSelectable,
  linkedRecordFormUniqueId,
  linkedRecords = [],
  linkedRecordType,
  linkField,
  linkFieldDisplay,
  mobileDisplay,
  mode,
  onRecordDeselect,
  onRecordSelect,
  onResultClick,
  permissions,
  phoneticFieldNames = [],
  primeroModule,
  recordType,
  recordViewForms,
  searchCaseType,
  searchFieldNames,
  SearchFormComponent = SearchForm,
  setFieldValue,
  shouldFetchRecord = true,
  showHeader,
  showSelectButton,
  validatedFieldNames = []
}) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { online } = useApp();

  const [component, setComponent] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const [detailsID, setDetailsID] = useState(null);
  const [shouldSelect, setShouldSelect] = useState(null);

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
    setDetailsID(null);
  };

  const handleAddNew = () => {
    setDrawerOpen(true);
    setDetailsID(null);
  };

  const handleOnRecordSelect = linkedRecord => {
    if (onRecordSelect) {
      onRecordSelect(linkedRecord);
    } else {
      setFieldValue(linkField, linkedRecord.get("id"));
    }
  };

  const handleOnRecordDeselect = linkedRecord => {
    if (onRecordDeselect) {
      onRecordDeselect(linkedRecord);
    } else {
      setFieldValue(linkField, null);
    }

    setDetailsID(null);
  };

  const handleSelection = linkedRecord => {
    if (shouldSelect) {
      handleOnRecordSelect(linkedRecord);
    } else {
      handleOnRecordDeselect(linkedRecord);
    }

    handleCancel();
  };

  const handleOpenMatch = async id => {
    setDetailsID(id);
    setShouldSelect(false);
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

  const handleReturnToResults = useCallback(() => {
    setDetailsID(null);
    setComponent(1);
  }, [setDetailsID]);

  useEffect(() => {
    if (!drawerOpen) {
      setComponent(!online ? 1 : 0);
    }
  }, [drawerOpen]);

  useEffect(() => {
    if (detailsID) {
      setComponent(2);
    }
  }, [detailsID]);

  const subformTitle = mode.isEdit ? i18n.t("fields.add_field_type", { file_type: formName }) : formName;
  const searchTitle = caseLinkedForm.i18nName
    ? drawerTitles.search || i18n.t(`${recordType}.search_for`, { record_type: i18n.t("case.label") })
    : drawerTitles.searchNoForm;
  const resultsTitle = drawerTitles.results || i18n.t(`${recordType}.results`);
  const detailsTitle = drawerTitles.details || formName;
  const disableAddNewTitle = addNewProps?.i18nKeys?.disableTooltip ? i18n.t(addNewProps.i18nKeys.disableTooltip) : "";

  return (
    <>
      <RecordFormTitle mobileDisplay={mobileDisplay} handleToggleNav={handleToggleNav} displayText={formName} />
      <div className={css.subformFieldArrayContainer}>
        <div>
          <h3 className={css.subformTitle}>{subformTitle}</h3>
        </div>
        {addNewProps?.show && (
          <ConditionalWrapper
            condition={disableOffline?.addNew && !online}
            wrapper={DisableOffline}
            offlineTextKey="unavailable_offline"
          >
            <ActionButton
              type={ACTION_BUTTON_TYPES.default}
              text={addNewProps?.i18nKeys?.label || "case.add_new"}
              rest={{ onClick: handleAddNew }}
              icon={<AddIcon />}
              disabled={addNewProps?.disable}
              tooltip={addNewProps?.disable && disableAddNewTitle}
            />
          </ConditionalWrapper>
        )}
      </div>

      {showHeader && (
        <RecordHeader
          fieldNames={headerFieldNames}
          linkedRecordType={linkedRecordType}
          handleOpenMatch={handleOpenMatch}
          linkedRecords={linkedRecords}
          idField={idField}
          formName={formName}
        />
      )}

      <SubformDrawer open={drawerOpen && component === 0} cancelHandler={handleCancel} title={searchTitle}>
        <SearchPanel handleCancel={handleCancel}>
          <SearchFormComponent
            fields={fields}
            formId={formId}
            locale={i18n.locale}
            permissions={permissions}
            phoneticFieldNames={phoneticFieldNames}
            searchCaseType={searchCaseType}
            redirectIfNotAllowed={redirectIfNotAllowed}
            setComponent={handleSetComponent}
            setSearchParams={handleSetSearchParams}
            validatedFieldNames={validatedFieldNames}
          />
        </SearchPanel>
      </SubformDrawer>

      <SubformDrawer open={drawerOpen && component === 1} cancelHandler={handleCancel} title={resultsTitle}>
        <Results
          fields={fields}
          handleCancel={handleCancel}
          linkedRecordType={linkedRecordType}
          locale={i18n.locale}
          online={online}
          searchParams={searchParams}
          setComponent={setComponent}
          permissions={permissions}
          recordType={recordType}
          columns={columns}
          redirectIfNotAllowed={redirectIfNotAllowed}
          setDetailsID={setDetailsID}
          setShouldSelect={setShouldSelect}
          isRecordSelectable={isRecordSelectable}
          onResultClick={onResultClick}
        />
      </SubformDrawer>

      <SubformDrawer open={drawerOpen && component === 2} cancelHandler={handleCancel} title={detailsTitle}>
        <ResultDetails
          id={detailsID}
          formName={formName}
          handleCancel={handleCancel}
          handleReturn={handleReturnToResults}
          handleSelection={handleSelection}
          linkedRecordFormUniqueId={linkedRecordFormUniqueId}
          linkedRecordType={linkedRecordType}
          recordType={recordType}
          linkField={linkField}
          linkFieldDisplay={linkFieldDisplay}
          permissions={permissions}
          primeroModule={primeroModule}
          redirectIfNotAllowed={redirectIfNotAllowed}
          setFieldValue={setFieldValue}
          showSelectButton={showSelectButton}
          recordViewForms={recordViewForms}
          shouldSelect={shouldSelect}
          shouldFetchRecord={shouldFetchRecord}
        />
      </SubformDrawer>
    </>
  );
}

Component.displayName = "CaseLinkedRecord";

Component.propTypes = {
  addNewProps: PropTypes.object.isRequired,
  caseFormUniqueId: PropTypes.string.isRequired,
  columns: PropTypes.array,
  disableOffline: PropTypes.object,
  drawerTitles: PropTypes.object.isRequired,
  formId: PropTypes.string.isRequired,
  handleToggleNav: PropTypes.func.isRequired,
  headerFieldNames: PropTypes.array.isRequired,
  idField: PropTypes.string,
  isPermitted: PropTypes.bool.isRequired,
  isRecordSelectable: PropTypes.func,
  linkedRecordFormUniqueId: PropTypes.string.isRequired,
  linkedRecords: PropTypes.array,
  linkedRecordType: PropTypes.string.isRequired,
  linkField: PropTypes.string.isRequired,
  linkFieldDisplay: PropTypes.string.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  mode: PropTypes.object.isRequired,
  onRecordDeselect: PropTypes.func,
  onRecordSelect: PropTypes.func,
  onResultClick: PropTypes.func,
  permissions: PropTypes.object.isRequired,
  phoneticFieldNames: PropTypes.array.isRequired,
  primeroModule: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired,
  recordViewForms: PropTypes.array,
  searchCaseType: PropTypes.string,
  searchFieldNames: PropTypes.array.isRequired,
  SearchFormComponent: PropTypes.object,
  setFieldValue: PropTypes.func.isRequired,
  shouldFetchRecord: PropTypes.bool.isRequired,
  showHeader: PropTypes.bool.isRequired,
  showSelectButton: PropTypes.bool.isRequired,
  validatedFieldNames: PropTypes.array.isRequired
};

export default Component;
