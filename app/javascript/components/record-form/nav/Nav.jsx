import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { List, IconButton, Drawer } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import Divider from "@material-ui/core/Divider";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/styles";

import { getRecordAlerts } from "../../records/selectors";
import { setSelectedForm, setSelectedRecord } from "../action-creators";
import { ConditionalWrapper } from "../../../libs";

import { NAME } from "./constants";
import NavGroup from "./NavGroup";
import RecordInformation from "./components/record-information";
import styles from "./styles.css";

const Nav = ({
  firstTab,
  formNav,
  handleToggleNav,
  isNew,
  mobileDisplay,
  recordType,
  selectedForm,
  selectedRecord,
  toggleNav
}) => {
  const [open, setOpen] = useState("");
  const dispatch = useDispatch();
  const css = makeStyles(styles)();

  const handleClick = args => {
    const { group, formId, parentItem } = args;

    if (group !== open) {
      setOpen(group);
    }

    dispatch(setSelectedForm(formId));

    if (!parentItem && mobileDisplay) {
      handleToggleNav();
    }
  };

  useEffect(() => {
    dispatch(setSelectedForm(firstTab.unique_id));
  }, []);

  useEffect(() => {
    dispatch(setSelectedRecord(selectedRecord));

    setOpen(firstTab.form_group_id);
  }, [firstTab]);

  const recordAlerts = useSelector(state => getRecordAlerts(state, recordType));

  const renderCloseButtonNavBar = mobileDisplay && (
    <div className={css.closeButtonRecordNav}>
      <IconButton onClick={handleToggleNav}>
        <CloseIcon />
      </IconButton>
    </div>
  );
  const drawerProps = {
    anchor: "left",
    open: toggleNav,
    onClose: handleToggleNav,
    classes: {
      paper: css.drawerPaper
    }
  };

  if (formNav) {
    const [...formGroups] = formNav.values();

    const renderFormGroups = formGroups.map(formGroup => {
      return (
        <NavGroup
          group={formGroup}
          handleClick={handleClick}
          isNew={isNew}
          key={formGroup.first().formId}
          open={open}
          recordAlerts={recordAlerts}
          selectedForm={selectedForm}
        />
      );
    });

    return (
      <>
        <ConditionalWrapper
          condition={mobileDisplay}
          wrapper={Drawer}
          {...drawerProps}
        >
          {renderCloseButtonNavBar}
          <List>
            <RecordInformation
              handleClick={handleClick}
              open={open}
              selectedForm={selectedForm}
            />
            <Divider />
            {renderFormGroups}
          </List>
        </ConditionalWrapper>
      </>
    );
  }

  return null;
};

Nav.displayName = NAME;

Nav.propTypes = {
  firstTab: PropTypes.object,
  formNav: PropTypes.object,
  handleToggleNav: PropTypes.func.isRequired,
  isNew: PropTypes.bool,
  mobileDisplay: PropTypes.bool.isRequired,
  recordType: PropTypes.string,
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedRecord: PropTypes.string,
  toggleNav: PropTypes.bool
};

export default Nav;
