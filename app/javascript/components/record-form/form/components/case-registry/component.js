import { useCallback, useEffect, useState } from "react";
import { List, ListItem, ListItemSecondaryAction, ListItemText } from "@material-ui/core";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import DisableOffline from "../../../../disable-offline";
import SubformDrawer from "../../subforms/subform-drawer";
import { useI18n } from "../../../../i18n";
import { ConditionalWrapper, useMemoizedSelector, useThemeHelper } from "../../../../../libs";
import { getFieldByName } from "../../../selectors";
import { CASE, REGISTRY_FROM_CASE, REGISTRY_RECORD, REGISTRY_RECORDS } from "../../../../../config";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../../../action-button";
import css from "../../subforms/styles.css";
import SubformEmptyData from "../../subforms/subform-empty-data";
import usePermissions, { RESOURCES } from "../../../../permissions";
import { READ_REGISTRY_RECORD, WRITE_REGISTRY_RECORD } from "../../../../../libs/permissions";
import { enqueueSnackbar } from "../../../../notifier";
import { fetchRecord, selectRecord } from "../../../../records";
import { getRecordFormsByUniqueId } from "../../..";
import { useApp } from "../../../../application";

import SearchForm from "./components/search-form";
import Results from "./components/results";
import ResultDetails from "./components/result-details";
import { LINK_FIELD, REGISTRY_SEARCH_FIELDS, REGISTRY_ID_DISPLAY, REGISTRY_NO, NAME } from "./constants";

const Component = ({ values, mode, primeroModule, recordType, setFieldValue }) => {
  const i18n = useI18n();
  const { isRTL } = useThemeHelper();
  const dispatch = useDispatch();
  const { online } = useApp();

  const [component, setComponent] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const [drawerTitle, setDrawerTitle] = useState("");

  const { registry_id_display: registryIdDisplay, registry_no: registryNo, registry_name: registryName } = values;

  const fieldValue = values[LINK_FIELD];

  const record = useMemoizedSelector(state =>
    selectRecord(state, { isEditOrShow: true, recordType: REGISTRY_RECORDS, id: fieldValue })
  );

  const caseRegistryForm = useMemoizedSelector(state =>
    getRecordFormsByUniqueId(state, {
      checkVisible: false,
      formName: REGISTRY_FROM_CASE,
      primeroModule,
      recordType: CASE,
      getFirst: true
    })
  );

  const title = caseRegistryForm.getIn(["name", i18n.locale], null);
  const formName = caseRegistryForm.i18nName ? i18n.t(title) : title;

  const { writeRegistryRecord, writeReadRegistryRecord } = usePermissions(RESOURCES.cases, {
    writeRegistryRecord: WRITE_REGISTRY_RECORD,
    writeReadRegistryRecord: [...WRITE_REGISTRY_RECORD, ...READ_REGISTRY_RECORD]
  });

  const fields = useMemoizedSelector(state =>
    getFieldByName(state, REGISTRY_SEARCH_FIELDS, primeroModule, REGISTRY_RECORD)
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

  const redirectIfNotAllowed = useCallback(
    permission => {
      if (!permission) {
        handleCancel();
        dispatch(enqueueSnackbar("", { messageKey: "error_page.not_authorized.title", type: "error" }));
      }
    },
    [writeReadRegistryRecord, writeRegistryRecord]
  );

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
    if (record.isEmpty() && fieldValue && !online) {
      dispatch(fetchRecord(REGISTRY_RECORDS, fieldValue));
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
      <div className={css.subformFieldArrayContainer}>
        <div>
          <h3 className={css.subformTitle}>{subformTitle}</h3>
        </div>
        {writeRegistryRecord && !fieldValue && !mode.isShow && (
          <div>
            <ActionButton type={ACTION_BUTTON_TYPES.default} text="case.add_new" rest={{ onClick: handleAddNew }} />
          </div>
        )}
      </div>
      {writeReadRegistryRecord &&
        (fieldValue ? (
          <List dense classes={{ root: css.list }} disablePadding>
            <ConditionalWrapper
              condition={!record.get("complete", false) && !online}
              wrapper={DisableOffline}
              offlineTextKey="unavailable_offline"
            >
              <ListItem component="a" onClick={handleOpenMatch} classes={{ root: css.listItem }}>
                <ListItemText classes={{ primary: css.listText, secondary: css.listTextSecondary }}>
                  <div className={css.listItemText}>
                    <span>{record.get(REGISTRY_ID_DISPLAY) || registryIdDisplay}</span>
                    <span>{record.get(REGISTRY_NO) || registryNo}</span>
                    <span>{record.get(NAME) || registryName}</span>
                  </div>
                </ListItemText>
                <ListItemSecondaryAction>
                  <ActionButton
                    icon={isRTL ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    type={ACTION_BUTTON_TYPES.icon}
                    rest={{
                      className: css.subformShow,
                      onClick: handleOpenMatch
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </ConditionalWrapper>
          </List>
        ) : (
          <SubformEmptyData subformName={formName} single />
        ))}

      <SubformDrawer open={drawerOpen} cancelHandler={handleCancel} title={drawerTitle}>
        {drawerOpen && (
          <RenderComponents
            id={fieldValue}
            setSearchParams={handleSetSearchParams}
            setComponent={handleSetComponent}
            setDrawerTitle={handleSetDrawerTitle}
            handleCancel={handleCancel}
            fields={fields}
            searchParams={searchParams}
            recordType={recordType}
            primeroModule={primeroModule}
            mode={mode}
            locale={i18n.locale}
            permissions={{ writeReadRegistryRecord, writeRegistryRecord }}
            redirectIfNotAllowed={redirectIfNotAllowed}
            setFieldValue={setFieldValue}
            formName={formName}
            noForm={caseRegistryForm.i18nName}
            online={online}
          />
        )}
      </SubformDrawer>
    </>
  );
};

Component.displayName = "CaseRegistry";

Component.propTypes = {
  mode: PropTypes.object.isRequired,
  primeroModule: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired
};

export default Component;
