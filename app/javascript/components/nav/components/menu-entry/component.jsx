import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { isEqual } from "lodash";

import { useI18n } from "../../../i18n";
import ListIcon from "../../../list-icon";
import Jewel from "../../../jewel";
import styles from "../../styles.css";
import DisableOffline from "../../../disable-offline";
import { getPermissions } from "../../../user/selectors";
import { ConditionalWrapper, useMemoizedSelector } from "../../../../libs";
import { useApp } from "../../../application";
import { setDialog } from "../../../action-dialog";
import { LOGOUT_DIALOG, NAV_SETTINGS } from "../../constants";
import { ROUTES } from "../../../../config";

const useStyles = makeStyles(styles);

const Component = ({ closeDrawer, menuEntry, mobileDisplay, jewelCount, username }) => {
  const { disabledApplication, online } = useApp();
  const css = useStyles();
  const i18n = useI18n();
  const dispatch = useDispatch();

  const { to, divider, icon, name, disableOffline, disabled, validateWithUserPermissions } = menuEntry;

  const jewel = jewelCount ? (
    <Jewel value={jewelCount} mobileDisplay={mobileDisplay} isForm={name === NAV_SETTINGS} />
  ) : null;

  const renderDivider = divider && <div className={css.navSeparator} />;

  const onClick = () => dispatch(setDialog({ dialog: LOGOUT_DIALOG, open: true, pending: false }));

  const navlinkProps = {
    ...(!disabledApplication &&
      !disabled && {
        component: NavLink,
        to,
        activeClassName: css.navActive,
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

  const renderNavAction = (
    <li>
      {renderDivider}
      <ConditionalWrapper condition={disableOffline} wrapper={DisableOffline} button>
        <ListItem {...navlinkProps} className={css.navLink}>
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
    return validateWithUserPermissions && userRecordTypes.includes(to.replace("/", "")) ? renderNavAction : null;
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
