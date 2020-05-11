import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { NavLink } from "react-router-dom";

import { useI18n } from "../../../i18n";
import ListIcon from "../../../list-icon";
import Jewel from "../../../jewel";
import styles from "../../styles.css";
import DisableOffline from "../../../disable-offline";
import { getPermissions } from "../../../user/selectors";
import { ConditionalWrapper } from "../../../../libs";

const Component = ({ menuEntry, mobileDisplay, jewelCount, username }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  const {
    to,
    divider,
    icon,
    name,
    disableOffline,
    disabled,
    validateWithUserPermissions
  } = menuEntry;

  const jewel = jewelCount ? (
    <Jewel value={jewelCount} mobileDisplay={mobileDisplay} />
  ) : null;

  const renderDivider = divider && <div className={css.navSeparator} />;

  const navlinkProps = {
    ...(!disabled && { component: NavLink, to, activeClassName: css.navActive })
  };
  const userPermissions = useSelector(state => getPermissions(state));
  const userRecordTypes = [...userPermissions.keys()];
  const navItemName = name === "username" ? username : i18n.t(name);

  const renderNavAction = (
    <div>
      {renderDivider}
      <ConditionalWrapper
        condition={disableOffline}
        wrapper={DisableOffline}
        button
      >
        <ListItem {...navlinkProps} className={css.navLink}>
          <ListItemIcon classes={{ root: css.listIcon }}>
            <ListIcon icon={icon} />
          </ListItemIcon>
          <ListItemText
            primary={navItemName}
            classes={{ primary: css.listText }}
          />
          {jewel}
        </ListItem>
      </ConditionalWrapper>
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
  jewelCount: PropTypes.number,
  menuEntry: PropTypes.object.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired
};

Component.displayName = "MenuEntry";

export default Component;
