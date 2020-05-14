import React from "react";
import {
  Home,
  Assessment,
  SwapVert,
  Group,
  ListAlt,
  HowToReg,
  AccountCircle,
  Help,
  Flag,
  MobileScreenShare,
  Person,
  People,
  SettingsApplications
} from "@material-ui/icons";
import PropTypes from "prop-types";

import {
  CasesIcon,
  IncidentsIcon,
  LogoutIcon
} from "../../images/primero-icons";

const ListIcon = ({ icon }) => {
  switch (icon) {
    case "home":
      return <Home />;
    case "cases":
      return <CasesIcon />;
    case "incidents":
      return <IncidentsIcon />;
    case "tracing_request":
      return <ListAlt />;
    case "matches":
      return <Group />;
    case "reports":
      return <Assessment />;
    case "exports":
      return <SwapVert />;
    case "tasks":
      return <HowToReg />;
    case "account":
      return <AccountCircle />;
    case "support":
      return <Help />;
    case "logout":
      return <LogoutIcon />;
    case "flagged_label":
      return <Flag />;
    case "mark_for_mobile":
      return <MobileScreenShare />;
    case "my_cases":
      return <Person />;
    case "referred_cases":
      return <People />;
    case "settings":
    case "roles":
    case "admin/forms":
      return <SettingsApplications />;
    default:
      return null;
  }
};

ListIcon.displayName = "ListIcon";

ListIcon.propTypes = {
  icon: PropTypes.string.isRequired
};

export default ListIcon;
