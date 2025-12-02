// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { NavLink } from "react-router-dom";
import { isEqual } from "lodash";
import { cx } from "@emotion/css";

import ListIcon from "../../../list-icon";
import Jewel from "../../../jewel";
import css from "../../styles.css";
import DisableOffline from "../../../disable-offline";
import { getCurrentUserGroupPermission, getPermissions } from "../../../user/selectors";
import { ConditionalWrapper, useMemoizedSelector } from "../../../../libs";
import { useApp } from "../../../application";
import { setDialog } from "../../../action-dialog";
import { LOGOUT_DIALOG, NAV_SETTINGS } from "../../constants";
import { ROUTES } from "../../../../config";
import useSystemStrings, { NAVIGATION } from "../../../application/use-system-strings";

function Component({ closeDrawer, menuEntry, mobileDisplay, jewelCount, username }) {
  const { disabledApplication, online, useContainedNavStyle } = useApp();

  const dispatch = useDispatch();
  const { label } = useSystemStrings(NAVIGATION);

  const {
    to,
    divider,
    icon,
    name,
    disableOffline,
    disabled,
    validateWithUserPermissions,
    resources,
    groupPermissions
  } = menuEntry;

  const jewel = jewelCount ? (
    <Jewel
      value={jewelCount}
      mobileDisplay={mobileDisplay}
      isForm={[NAV_SETTINGS, "navigation.support"].includes(name)}
      data-testid="jewel"
    />
  ) : null;

  const renderDivider = divider && <div className={css.navSeparator} />;

  const onClick = () => dispatch(setDialog({ dialog: LOGOUT_DIALOG, open: true, pending: false }));

  const navlinkProps = {
    ...(!disabledApplication &&
      !disabled && {
        component: NavLink,
        to,
        activeClassName: cx(css.navActive, { [css.contained]: useContainedNavStyle }),
        onClick: closeDrawer,
        disabled: disabledApplication
      }),
    ...(!disabledApplication &&
      !online &&
      to === ROUTES.logout && {
        to: false,
        onClick
      })
  };

  const userPermissions = useMemoizedSelector(state => getPermissions(state), isEqual);
  const userGroupPermission = useMemoizedSelector(state => getCurrentUserGroupPermission(state));

  const userRecordTypes = [...userPermissions.keys()];
  const navItemName = name === "username" ? username : label(name);
  const navLinkClasses = cx(css.navLink, { [css.contained]: useContainedNavStyle });
  const renderNavAction = (
    <li id={name}>
      {renderDivider}
      <ConditionalWrapper condition={disableOffline} wrapper={DisableOffline} button data-testid="conditional-wrapper">
        <ListItem data-testid="listItem" {...navlinkProps} className={navLinkClasses}>
          <ListItemIcon classes={{ root: css.listIcon }}>
            <ListIcon icon={icon} />
          </ListItemIcon>
          <ListItemText data-testid="listItemText" primary={navItemName} classes={{ primary: css.listText }} />
          {jewel}
        </ListItem>
      </ConditionalWrapper>
    </li>
  );

  if (
    validateWithUserPermissions === true &&
    !userRecordTypes.includes(to.replace("/", "")) &&
    !userRecordTypes.includes(resources)
  ) {
    return null;
  }

  if (Array.isArray(groupPermissions) && !groupPermissions.includes(userGroupPermission)) {
    return null;
  }

  return renderNavAction;
}

Component.propTypes = {
  closeDrawer: PropTypes.func.isRequired,
  jewelCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
  menuEntry: PropTypes.object.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired
};

Component.displayName = "MenuEntry";

export default Component;
