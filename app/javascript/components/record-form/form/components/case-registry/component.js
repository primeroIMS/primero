/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */
import { useCallback, useEffect, useState } from "react";
import { List, ListItem, ListItemSecondaryAction, ListItemText } from "@material-ui/core";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";

import SubformDrawer from "../../subforms/subform-drawer";
import { useI18n } from "../../../../i18n";
import { useMemoizedSelector, useThemeHelper } from "../../../../../libs";
import { getFieldByName } from "../../../selectors";
import { CASE } from "../../../../../config";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../../../action-button";
import css from "../../subforms/styles.css";
import SubformEmptyData from "../../subforms/subform-empty-data";

import SearchForm from "./components/search-form";
import Results from "./components/results";
import ResultDetails from "./components/result-details";
import { LINK_FIELD } from "./constants";

const Component = ({ values, mode, record, primeroModule, recordType }) => {
  const i18n = useI18n();
  const { isRTL } = useThemeHelper();

  const [component, setComponent] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const [drawerTitle, setDrawerTitle] = useState("");

  const fields = useMemoizedSelector(state =>
    getFieldByName(state, ["location_current", "name", "registry_no"], primeroModule, CASE)
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
    index => {
      setDrawerTitle(index);
    },
    [drawerTitle]
  );

  useEffect(() => {
    if (!drawerOpen) {
      setComponent(0);
    }
  }, [drawerOpen]);

  const fieldValue = values[LINK_FIELD];

  const RenderComponents = {
    0: SearchForm,
    1: Results,
    2: ResultDetails
  }[component];

  return (
    <>
      <div className={css.subformFieldArrayContainer}>
        <div>
          <h3 className={css.subformTitle}>Add Farmer Details</h3>
        </div>
        {!fieldValue && !mode.isShow && (
          <div>
            <ActionButton type={ACTION_BUTTON_TYPES.default} text="Add New" rest={{ onClick: handleAddNew }} />
          </div>
        )}
      </div>

      {fieldValue ? (
        <List dense classes={{ root: css.list }} disablePadding>
          <ListItem component="a" onClick={handleOpenMatch} classes={{ root: css.listItem }}>
            <ListItemText>{fieldValue}</ListItemText>
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
        </List>
      ) : (
        <SubformEmptyData subformName="Farmer" />
      )}

      <SubformDrawer open={drawerOpen} cancelHandler={handleCancel} title={drawerTitle}>
        <RenderComponents
          setSearchParams={handleSetSearchParams}
          setComponent={handleSetComponent}
          setDrawerTitle={handleSetDrawerTitle}
          handleCancel={handleCancel}
          fields={fields}
          searchParams={searchParams}
          recordType={recordType}
          primeroModule={primeroModule}
          mode={mode}
        />
      </SubformDrawer>
    </>
  );
};

Component.displayName = "CaseRegistry";

export default Component;
