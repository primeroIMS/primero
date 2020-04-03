import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { NavLink } from "react-router-dom";

import ListIcon from "../../../list-icon";
import Jewel from "../../../jewel";
import styles from "../../styles.css";
import DisableOffline from "../../../disable-offline";
import { getPermissions } from "../../../user/selectors";

const Component = ({ menuEntry, mobileDisplay }) => {
  const css = makeStyles(styles)();
  const {
    to,
    divider,
    icon,
    jewelCount,
    name,
    disableOffline,
    disabled,
    validateWithUserPermissions
  } = menuEntry;

  const jewel = jewelCount ? (
    <Jewel value={jewelCount} mobileDisplay={mobileDisplay} />
  ) : null;

  const renderDivider = divider && <div className={css.navSeparator} />;

  const DisabledOffline = disableOffline ? DisableOffline : Fragment;

  const navlinkProps = {
    ...(!disabled && { component: NavLink, to })
  };
  const userPermissions = useSelector(state => getPermissions(state));
  const userRecordTypes = [...userPermissions.keys()];

  const renderNavAction = (
    <div>
      {renderDivider}
      <DisabledOffline>
        <ListItem
          {...navlinkProps}
          className={css.navLink}
          activeClassName={css.navActive}
        >
          <ListItemIcon classes={{ root: css.listIcon }}>
            <ListIcon icon={icon} />
          </ListItemIcon>
          <ListItemText primary={name} classes={{ primary: css.listText }} />
          {jewel}
        </ListItem>
      </DisabledOffline>
    </div>
  );

  if (typeof validateWithUserPermissions !== "undefined") {
    return validateWithUserPermissions &&
      userRecordTypes.includes(to.replace("/", ""))
      ? renderNavAction
      : null;
  }

  return renderNavAction;
};

Component.propTypes = {
  menuEntry: PropTypes.object.isRequired,
  mobileDisplay: PropTypes.bool.isRequired
};

Component.displayName = "MenuEntry";

export default Component;
