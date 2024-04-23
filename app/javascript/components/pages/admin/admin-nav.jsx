// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Fragment, useState } from "react";
import { List, Collapse } from "@material-ui/core";
import { isEqual } from "lodash";

import { getPermissions } from "../../user/selectors";
import { ADMIN_NAV, LOCATION_PATH } from "../../../config/constants";
import { usePermissions, checkPermissions, RESOURCES, MANAGE } from "../../permissions";
import { useMemoizedSelector } from "../../../libs";
import { getLocationsAvailable } from "../../application/selectors";
import { useI18n } from "../../i18n";
import { PageHeading } from "../../page";

import css from "./styles.css";
import AdminNavItem from "./admin-nav-item";
import { getAdminResources } from "./utils";

const AdminNav = () => {
  const i18n = useI18n();

  const userPermissions = useMemoizedSelector(state => getPermissions(state), isEqual);
  const hasLocationsAvailable = useMemoizedSelector(state => getLocationsAvailable(state));

  const canManageMetadata = usePermissions(RESOURCES.metadata, MANAGE);

  const adminResources = getAdminResources(userPermissions);

  const [open, setOpen] = useState(false || adminResources[0] === RESOURCES.metadata);

  const handleClick = () => {
    setOpen(!open);
  };

  const hasNavPermission = (type, permission) => {
    if (type && permission) {
      return checkPermissions(userPermissions.get(type), permission);
    }

    return true;
  };

  const renderNavItems = ADMIN_NAV.map(nav => {
    const isParent = "items" in nav;
    const { recordType, permission } = nav;
    const renderJewel = canManageMetadata && nav.to === LOCATION_PATH && !hasLocationsAvailable;

    if (!hasNavPermission(recordType, permission)) {
      return null;
    }

    if (isParent) {
      const renderChildren = nav.items.map(navItem => {
        const { recordType: navItemRecordType, permission: navItemPermission } = navItem;

        if (!hasNavPermission(navItemRecordType, navItemPermission)) {
          return null;
        }

        return <AdminNavItem key={`${navItem.to}-child`} item={navItem} nestedClass={css.nestedItem} />;
      });

      return (
        <Fragment key={`${nav.to}-parent`}>
          <AdminNavItem item={nav} open={open} handleClick={handleClick} isParent />
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {renderChildren}
            </List>
          </Collapse>
        </Fragment>
      );
    }

    return <AdminNavItem key={`${nav.to}-group`} item={nav} renderJewel={renderJewel} />;
  });

  return (
    <>
      <PageHeading title={i18n.t("settings.title")} disabledElevation />
      <List component="nav">{renderNavItems}</List>
    </>
  );
};

AdminNav.displayName = "AdminNav";

export default AdminNav;
