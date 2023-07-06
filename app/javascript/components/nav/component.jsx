import { Drawer, List, useMediaQuery, Hidden, Divider, IconButton } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CloseIcon from "@material-ui/icons/Close";
import { push } from "connected-react-router";
import { isEqual } from "lodash";

import { ROUTES, PERMITTED_URL, APPLICATION_NAV } from "../../config";
import AgencyLogo from "../agency-logo";
import ModuleLogo from "../module-logo";
import useMemoizedSelector from "../../libs/use-memoized-selector";
import MobileToolbar from "../mobile-toolbar";
import { useApp } from "../application";
import Permission, { usePermissions, MANAGE, RESOURCES } from "../permissions";
import { getLocationsAvailable } from "../application/selectors";
import TranslationsToggle from "../translations-toggle";
import NetworkIndicator from "../network-indicator";
import { getPermissions } from "../user";
import ActionDialog, { useDialog } from "../action-dialog";
import { useI18n } from "../i18n";
import { hasQueueData } from "../connectivity/selectors";
import FieldMode from "../network-indicator/components/field-mode";

import { NAME, LOGOUT_DIALOG } from "./constants";
import css from "./styles.css";
import { fetchAlerts } from "./action-creators";
import { getUserId, selectUsername, selectAlerts } from "./selectors";
import MenuEntry from "./components/menu-entry";

const Nav = () => {
  const mobileDisplay = useMediaQuery(theme => theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const i18n = useI18n();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { dialogOpen, dialogClose } = useDialog(LOGOUT_DIALOG);

  useEffect(() => {
    dispatch(fetchAlerts());
  }, []);

  const { demo } = useApp();

  const username = useMemoizedSelector(state => selectUsername(state), isEqual);
  const userId = useMemoizedSelector(state => getUserId(state), isEqual);
  const dataAlerts = useMemoizedSelector(state => selectAlerts(state), isEqual);
  const permissions = useMemoizedSelector(state => getPermissions(state), isEqual);
  const hasLocationsAvailable = useMemoizedSelector(state => getLocationsAvailable(state), isEqual);
  const hasUnsubmittedOfflineChanges = useMemoizedSelector(state => hasQueueData(state));

  const canManageMetadata = usePermissions(RESOURCES.metadata, MANAGE);

  const handleToggleDrawer = open => event => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setDrawerOpen(open);
  };

  const handleLogoutCancel = () => dialogClose();

  const handleLogout = () => {
    dispatch(push(ROUTES.logout));
  };

  const permittedMenuEntries = menuEntries => {
    return menuEntries.map(menuEntry => {
      if (menuEntry.component) {
        const CustomComponent = {
          fieldMode: FieldMode
        }[menuEntry.component];

        return <CustomComponent />;
      }

      const jewel = dataAlerts.get(menuEntry?.jewelCount, null);
      const route = `/${menuEntry.to.split("/").filter(Boolean)[0]}`;
      const jewelCount =
        jewel ||
        (canManageMetadata && route === ROUTES.admin && !hasLocationsAvailable) ||
        (hasUnsubmittedOfflineChanges && route === ROUTES.support);
      const renderedMenuEntries = (
        <MenuEntry
          key={menuEntry.to}
          menuEntry={menuEntry}
          mobileDisplay={mobileDisplay}
          jewelCount={jewelCount}
          username={username}
          closeDrawer={handleToggleDrawer(false)}
        />
      );

      return PERMITTED_URL.includes(route) ? (
        renderedMenuEntries
      ) : (
        <Permission key={menuEntry.to} resources={menuEntry.resources} actions={menuEntry.actions}>
          {renderedMenuEntries}
        </Permission>
      );
    });
  };

  const drawerContent = (
    <>
      <Hidden smDown implementation="css">
        <ModuleLogo username={username} />
      </Hidden>
      <div className={css.drawerHeaderContainer}>
        <Hidden mdUp implementation="css">
          <div className={css.drawerHeader}>
            <IconButton onClick={handleToggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <Divider />
        </Hidden>
      </div>
      <NetworkIndicator />
      <List className={css.navList}>{permittedMenuEntries(APPLICATION_NAV(permissions, userId))}</List>
      <div className={css.navAgencies}>
        <AgencyLogo />
      </div>
      <TranslationsToggle />
    </>
  );

  const commonDrawerProps = {
    anchor: "left",
    open: drawerOpen,
    classes: {
      root: css.drawerRoot,
      paper: css[demo ? "drawerPaper-demo" : "drawerPaper"]
    },
    onClose: handleToggleDrawer(false)
  };

  return (
    <nav className={css.nav}>
      <MobileToolbar
        openDrawer={handleToggleDrawer(true)}
        hasUnsubmittedOfflineChanges={hasUnsubmittedOfflineChanges}
      />
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          {...commonDrawerProps}
          ModalProps={{
            keepMounted: true
          }}
        >
          {drawerContent}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer variant="permanent" {...commonDrawerProps}>
          {drawerContent}
        </Drawer>
      </Hidden>
      <ActionDialog
        dialogTitle={i18n.t("messages.logout_dialog_header")}
        cancelHandler={handleLogoutCancel}
        successHandler={handleLogout}
        confirmButtonLabel={i18n.t("buttons.logout")}
        onClose={dialogClose}
        omitCloseAfterSuccess
        open={dialogOpen}
      >
        {i18n.t("messages.logout_offline_warning")}
      </ActionDialog>
    </nav>
  );
};

Nav.displayName = NAME;

export default Nav;
