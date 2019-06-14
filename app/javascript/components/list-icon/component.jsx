import React from "react";
import {
  Home,
  Assessment,
  SwapVert,
  Group,
  ListAlt,
  HowToReg,
  AccountCircle,
  Help
} from "@material-ui/icons";
import PropTypes from "prop-types";
import { CasesIcon, IncidentsIcon } from "images/primero-icons";

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
    default:
      return null;
  }
};

ListIcon.propTypes = {
  icon: PropTypes.string.isRequired
};

export default ListIcon;
