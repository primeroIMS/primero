// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { isEqual } from "lodash";
import clsx from "clsx";

import { useI18n } from "../../../i18n";
import ListIcon from "../../../list-icon";
import Jewel from "../../../jewel";
import css from "../../styles.css";
import DisableOffline from "../../../disable-offline";
import { getPermissions } from "../../../user/selectors";
import { ConditionalWrapper, useMemoizedSelector } from "../../../../libs";
import { useApp } from "../../../application";
import { setDialog } from "../../../action-dialog";
import { LOGOUT_DIALOG, NAV_SETTINGS } from "../../constants";
import { ROUTES } from "../../../../config";

const Component = ({ closeDrawer, menuEntry, mobileDisplay, jewelCount, username }) => {
  const { disabledApplication, online, useContainedNavStyle } = useApp();

  const i18n = useI18n();
  const dispatch = useDispatch();

  const { to, divider, icon, name, disableOffline, disabled, validateWithUserPermissions, resources } = menuEntry;

  const jewel = jewelCount ? (
    <Jewel
      value={jewelCount}
      mobileDisplay={mobileDisplay}
      isForm={[NAV_SETTINGS, "navigation.support"].includes(name)}
    />
  ) : null;

  const renderDivider = divider && <div className={css.navSeparator} />;

  const onClick = () => dispatch(setDialog({ dialog: LOGOUT_DIALOG, open: true, pending: false }));

  const navlinkProps = {
    ...(!disabledApplication &&
      !disabled && {
        component: NavLink,
        to,
        activeClassName: clsx(css.navActive, { [css.contained]: useContainedNavStyle }),
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

  const userRecordTypes = [...userPermissions.keys()];
  const navItemName = name === "username" ? username : i18n.t(name);
  const navLinkClasses = clsx(css.navLink, { [css.contained]: useContainedNavStyle });

  const renderNavAction = (
    <li id={name}>
      {renderDivider}
      <ConditionalWrapper condition={disableOffline} wrapper={DisableOffline} button>
        <ListItem {...navlinkProps} className={navLinkClasses}>
          <ListItemIcon classes={{ root: css.listIcon }}>
            <ListIcon icon={icon} />
          </ListItemIcon>
          <ListItemText primary={navItemName} classes={{ primary: css.listText }} />
          {jewel}
        </ListItem>
      </ConditionalWrapper>
    </li>
  );

  if (typeof validateWithUserPermissions !== "undefined") {
    return validateWithUserPermissions &&
      (userRecordTypes.includes(to.replace("/", "")) || userRecordTypes.includes(resources))
      ? renderNavAction
      : null;
  }

  return renderNavAction;
};

Component.propTypes = {
  closeDrawer: PropTypes.func.isRequired,
  jewelCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
  menuEntry: PropTypes.object.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired
};

Component.displayName = "MenuEntry";

export default Component;
