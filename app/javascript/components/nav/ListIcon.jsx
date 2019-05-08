import React from "react";
import HomeIcon from "@material-ui/icons/Home";
import AssessmentIcon from "@material-ui/icons/Assessment";
import SwapVertIcon from "@material-ui/icons/SwapVert";
import GroupIcon from "@material-ui/icons/Group";
import ListAltIcon from "@material-ui/icons/ListAlt";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import PropTypes from "prop-types";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import HelpIcon from "@material-ui/icons/Help";

import { CasesIcon, IncidentsIcon } from "images/primero-icons";

const ListIcon = ({ icon }) => {
  switch (icon) {
    case "home":
      return <HomeIcon />;
    case "cases":
      return <CasesIcon />;
    case "incidents":
      return <IncidentsIcon />;
    case "tracing_request":
      return <ListAltIcon />;
    case "matches":
      return <GroupIcon />;
    case "reports":
      return <AssessmentIcon />;
    case "exports":
      return <SwapVertIcon />;
    case "tasks":
      return <HowToRegIcon />;
    case "account":
      return <AccountCircleIcon />;
    case "support":
      return <HelpIcon />;
    default:
      return null;
  }
};

ListIcon.propTypes = {
  icon: PropTypes.string.isRequired
};

export default ListIcon;
